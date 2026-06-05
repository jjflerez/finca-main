package com.fincas.gestion.service;

import com.fincas.gestion.model.Recibo;
import com.fincas.gestion.repository.ReciboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReciboService {

    @Autowired
    private ReciboRepository reciboRepository;

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

    public Optional<Recibo> obtenerPorId(Long id) {
        return reciboRepository.findById(id);
    }

    public Recibo crear(Recibo recibo) {
        // Asignar número de recibo único por inmueble
        Long siguiente = reciboRepository
                .findTopByInmuebleIdOrderByNumeroReciboDesc(recibo.getInmuebleId())
                .map(r -> r.getNumeroRecibo() + 1)
                .orElse(1L);
        recibo.setNumeroRecibo(siguiente);
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
