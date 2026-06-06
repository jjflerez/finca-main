package com.fincas.gestion.service;

import com.fincas.gestion.model.Local;
import com.fincas.gestion.model.Piso;
import com.fincas.gestion.model.Recibo;
import com.fincas.gestion.repository.LocalRepository;
import com.fincas.gestion.repository.PisoRepository;
import com.fincas.gestion.repository.ReciboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReciboService {

    @Autowired
    private ReciboRepository reciboRepository;

    @Autowired
    private PisoRepository pisoRepository;

    @Autowired
    private LocalRepository localRepository;

    public List<Recibo> listarTodos() {
        return reciboRepository.findAll();
    }

    public List<Recibo> listarPorInmueble(String inmuebleId) {
        return reciboRepository.findByInmuebleIdOrderByFechaEmisionDesc(inmuebleId);
    }

    public List<Recibo> listarPendientes() {
        return reciboRepository.findByCobradoFalse();
    }

    public List<Recibo> listarPendientesEnRango(LocalDate desde, LocalDate hasta) {
        return reciboRepository.findByCobradoFalseAndFechaEmisionBetween(desde, hasta);
    }

    public List<Recibo> listarCobradosEnRango(LocalDate desde, LocalDate hasta) {
        return reciboRepository.findByCobradoTrueAndFechaEmisionBetween(desde, hasta);
    }

    public Optional<Recibo> obtenerPorId(Long id) {
        return reciboRepository.findById(id);
    }

    public Recibo crear(Recibo recibo) {
        // Asignar número de recibo único por inmueble (fijo, no varía)
        // Buscar si ya existe un número de recibo para este inmueble
        Long numeroExistente = reciboRepository
                .findTopByInmuebleIdOrderByNumeroReciboDesc(recibo.getInmuebleId())
                .map(Recibo::getNumeroRecibo)
                .orElse(null);

        if (numeroExistente != null) {
            // Usar el mismo número de recibo que ya tiene este inmueble
            recibo.setNumeroRecibo(numeroExistente);
        } else {
            // Es la primera vez: asignar uno nuevo
            Long maxGlobal = reciboRepository.findAll().stream()
                    .map(Recibo::getNumeroRecibo)
                    .filter(Objects::nonNull)
                    .max(Long::compareTo)
                    .orElse(0L);
            recibo.setNumeroRecibo(maxGlobal + 1);
        }

        if (recibo.getFechaEmision() == null) {
            recibo.setFechaEmision(LocalDate.now());
        }
        return reciboRepository.save(recibo);
    }

    // Copiar recibo del mes anterior para el mismo inmueble
    public Optional<Recibo> copiarMesAnterior(String inmuebleId) {
        return reciboRepository
                .findTopByInmuebleIdAndFechaEmisionBeforeOrderByFechaEmisionDesc(inmuebleId, LocalDate.now())
                .map(anterior -> {
                    Recibo nuevo = new Recibo();
                    nuevo.setInmuebleId(anterior.getInmuebleId());
                    nuevo.setInquilinoDni(anterior.getInquilinoDni());
                    nuevo.setRenta(anterior.getRenta());
                    nuevo.setAgua(anterior.getAgua());
                    nuevo.setLuz(anterior.getLuz());
                    nuevo.setIpc(anterior.getIpc());
                    nuevo.setPorteria(anterior.getPorteria());
                    nuevo.setIva(anterior.getIva());
                    nuevo.setOtrosConceptos(anterior.getOtrosConceptos());
                    nuevo.setDescripcionOtros(anterior.getDescripcionOtros());
                    nuevo.setFechaEmision(LocalDate.now()); // Solo cambia la fecha
                    nuevo.setCobrado(false);
                    return crear(nuevo);
                });
    }

    /**
     * Generación masiva de recibos mensuales.
     * Copia los recibos del mes anterior para todos los pisos y locales alquilados.
     */
    public List<Recibo> generarRecibosMensuales() {
        List<Recibo> generados = new ArrayList<>();

        // Pisos alquilados
        List<Piso> pisosAlquilados = pisoRepository.findByActivoTrueAndInquilinoIdIsNotNull();
        for (Piso piso : pisosAlquilados) {
            Optional<Recibo> copiado = copiarMesAnterior(piso.getId());
            if (copiado.isPresent()) {
                generados.add(copiado.get());
            } else {
                // No hay recibo anterior, crear uno nuevo con la renta del piso
                Recibo nuevo = new Recibo();
                nuevo.setInmuebleId(piso.getId());
                nuevo.setInquilinoDni(piso.getInquilinoId());
                nuevo.setRenta(piso.getRentaMensual());
                nuevo.setFechaEmision(LocalDate.now());
                nuevo.setCobrado(false);
                generados.add(crear(nuevo));
            }
        }

        // Locales alquilados
        List<Local> localesAlquilados = localRepository.findByActivoTrueAndInquilinoIdIsNotNull();
        for (Local local : localesAlquilados) {
            Optional<Recibo> copiado = copiarMesAnterior(local.getId());
            if (copiado.isPresent()) {
                generados.add(copiado.get());
            } else {
                Recibo nuevo = new Recibo();
                nuevo.setInmuebleId(local.getId());
                nuevo.setInquilinoDni(local.getInquilinoId());
                nuevo.setRenta(local.getRentaMensual());
                if (local.isTieneIVA()) {
                    nuevo.setIva(local.getRentaMensual() * 0.21);
                }
                nuevo.setFechaEmision(LocalDate.now());
                nuevo.setCobrado(false);
                generados.add(crear(nuevo));
            }
        }

        return generados;
    }

    /**
     * Inicializar un concepto de recibos a una cantidad determinada.
     * Aplica a los recibos del mes/año indicados o a todos los pendientes.
     */
    public record InicializarConceptoRequest(String concepto, double cantidad,
                                              Integer mes, Integer anio) {}

    public List<Recibo> inicializarConcepto(InicializarConceptoRequest req) {
        List<Recibo> recibos;
        if (req.mes() != null && req.anio() != null) {
            LocalDate desde = LocalDate.of(req.anio(), req.mes(), 1);
            LocalDate hasta = desde.withDayOfMonth(desde.lengthOfMonth());
            recibos = reciboRepository.findByFechaEmisionBetween(desde, hasta);
        } else {
            recibos = reciboRepository.findByCobradoFalse();
        }

        for (Recibo recibo : recibos) {
            switch (req.concepto().toLowerCase()) {
                case "renta" -> recibo.setRenta(req.cantidad());
                case "agua" -> recibo.setAgua(req.cantidad());
                case "luz" -> recibo.setLuz(req.cantidad());
                case "ipc" -> recibo.setIpc(req.cantidad());
                case "porteria" -> recibo.setPorteria(req.cantidad());
                case "iva" -> recibo.setIva(req.cantidad());
                case "otros", "otrosconceptos" -> recibo.setOtrosConceptos(req.cantidad());
            }
        }

        return reciboRepository.saveAll(recibos);
    }

    /**
     * Formato de impresión: devuelve el recibo con solo los conceptos != 0.
     */
    public Optional<Map<String, Object>> obtenerParaImpresion(Long id) {
        return reciboRepository.findById(id).map(recibo -> {
            Map<String, Object> impresion = new LinkedHashMap<>();
            impresion.put("id", recibo.getId());
            impresion.put("numeroRecibo", recibo.getNumeroRecibo());
            impresion.put("inmuebleId", recibo.getInmuebleId());
            impresion.put("inquilinoDni", recibo.getInquilinoDni());
            impresion.put("fechaEmision", recibo.getFechaEmision());
            impresion.put("cobrado", recibo.isCobrado());

            // Solo incluir conceptos con importe != 0
            Map<String, Double> conceptos = new LinkedHashMap<>();
            if (recibo.getRenta() != 0) conceptos.put("Renta", recibo.getRenta());
            if (recibo.getAgua() != 0) conceptos.put("Agua", recibo.getAgua());
            if (recibo.getLuz() != 0) conceptos.put("Luz", recibo.getLuz());
            if (recibo.getIpc() != 0) conceptos.put("Actualización IPC", recibo.getIpc());
            if (recibo.getPorteria() != 0) conceptos.put("Portería", recibo.getPorteria());
            if (recibo.getIva() != 0) conceptos.put("IVA", recibo.getIva());
            if (recibo.getOtrosConceptos() != 0) {
                String desc = recibo.getDescripcionOtros() != null ? recibo.getDescripcionOtros() : "Otros";
                conceptos.put(desc, recibo.getOtrosConceptos());
            }

            impresion.put("conceptos", conceptos);
            impresion.put("total", recibo.getTotalRecibo());
            return impresion;
        });
    }

    public Optional<Recibo> actualizar(Long id, Recibo datos) {
        return reciboRepository.findById(id).map(recibo -> {
            recibo.setRenta(datos.getRenta());
            recibo.setAgua(datos.getAgua());
            recibo.setLuz(datos.getLuz());
            recibo.setIpc(datos.getIpc());
            recibo.setPorteria(datos.getPorteria());
            recibo.setIva(datos.getIva());
            recibo.setOtrosConceptos(datos.getOtrosConceptos());
            recibo.setDescripcionOtros(datos.getDescripcionOtros());
            recibo.setFechaEmision(datos.getFechaEmision());
            recibo.setInquilinoDni(datos.getInquilinoDni());
            return reciboRepository.save(recibo);
        });
    }

    public Optional<Recibo> marcarCobrado(Long id, boolean cobrado) {
        return reciboRepository.findById(id).map(recibo -> {
            recibo.setCobrado(cobrado);
            return reciboRepository.save(recibo);
        });
    }

    public void eliminar(Long id) {
        reciboRepository.deleteById(id);
    }
}
