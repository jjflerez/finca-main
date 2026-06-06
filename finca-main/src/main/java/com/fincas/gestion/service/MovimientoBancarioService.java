package com.fincas.gestion.service;

import com.fincas.gestion.model.Banco;
import com.fincas.gestion.model.CuentaBancaria;
import com.fincas.gestion.model.MovimientoBancario;
import com.fincas.gestion.repository.BancoRepository;
import com.fincas.gestion.repository.CuentaBancariaRepository;
import com.fincas.gestion.repository.MovimientoBancarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovimientoBancarioService {

    @Autowired
    private MovimientoBancarioRepository movimientoRepository;

    @Autowired
    private CuentaBancariaRepository cuentaRepository;

    @Autowired
    private BancoRepository bancoRepository;

    // --- Bancos ---
    public List<Banco> listarBancos() { return bancoRepository.findAll(); }
    public Banco crearBanco(Banco banco) { return bancoRepository.save(banco); }
    public Optional<Banco> obtenerBanco(Long id) { return bancoRepository.findById(id); }

    public Optional<Banco> actualizarBanco(Long id, Banco datos) {
        return bancoRepository.findById(id).map(banco -> {
            banco.setNombre(datos.getNombre());
            banco.setCodigo(datos.getCodigo());
            return bancoRepository.save(banco);
        });
    }

    public void eliminarBanco(Long id) {
        bancoRepository.deleteById(id);
    }

    // --- Cuentas ---
    public List<CuentaBancaria> listarTodasCuentas() {
        return cuentaRepository.findAll();
    }

    public List<CuentaBancaria> listarCuentasPorBanco(Long bancoId) {
        return cuentaRepository.findByBancoId(bancoId);
    }

    public List<CuentaBancaria> listarCuentasPorInmueble(String inmuebleId) {
        return cuentaRepository.findByInmuebleId(inmuebleId);
    }

    public Optional<CuentaBancaria> obtenerCuenta(Long id) {
        return cuentaRepository.findById(id);
    }

    public CuentaBancaria crearCuenta(Long bancoId, CuentaBancaria cuenta) {
        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new RuntimeException("Banco no encontrado"));
        cuenta.setBanco(banco);
        return cuentaRepository.save(cuenta);
    }

    public Optional<CuentaBancaria> actualizarCuenta(Long id, CuentaBancaria datos) {
        return cuentaRepository.findById(id).map(cuenta -> {
            cuenta.setNumeroCuenta(datos.getNumeroCuenta());
            cuenta.setInmuebleId(datos.getInmuebleId());
            return cuentaRepository.save(cuenta);
        });
    }

    public void eliminarCuenta(Long id) {
        cuentaRepository.deleteById(id);
    }

    // --- Movimientos ---
    public List<MovimientoBancario> listarTodos() { return movimientoRepository.findAll(); }

    public List<MovimientoBancario> listarPorCuenta(Long cuentaId) {
        return movimientoRepository.findByCuentaBancariaId(cuentaId);
    }

    public List<MovimientoBancario> listarPorInmueble(String inmuebleId) {
        return movimientoRepository.findByInmuebleId(inmuebleId);
    }

    public List<MovimientoBancario> listarPorRangoFecha(LocalDate desde, LocalDate hasta) {
        return movimientoRepository.findByFechaBetween(desde, hasta);
    }

    public List<MovimientoBancario> listarPorTipo(MovimientoBancario.TipoMovimiento tipo) {
        return movimientoRepository.findByTipo(tipo);
    }

    public MovimientoBancario registrar(MovimientoBancario movimiento) {
        if (movimiento.getFecha() == null) {
            movimiento.setFecha(LocalDate.now());
        }
        // Actualizar saldo de la cuenta
        if (movimiento.getCuentaBancaria() != null) {
            cuentaRepository.findById(movimiento.getCuentaBancaria().getId()).ifPresent(cuenta -> {
                if (movimiento.getTipo() == MovimientoBancario.TipoMovimiento.INGRESO) {
                    cuenta.setSaldo(cuenta.getSaldo() + movimiento.getImporte());
                } else {
                    cuenta.setSaldo(cuenta.getSaldo() - movimiento.getImporte());
                }
                cuentaRepository.save(cuenta);
                movimiento.setCuentaBancaria(cuenta);
            });
        }
        return movimientoRepository.save(movimiento);
    }

    // --- Informes para declaración de la renta ---

    // Resumen básico
    public record ResumenEconomico(double totalIngresos, double totalGastos, double balance) {}

    public ResumenEconomico resumenAnual(int anio) {
        LocalDate inicio = LocalDate.of(anio, 1, 1);
        LocalDate fin = LocalDate.of(anio, 12, 31);
        List<MovimientoBancario> movimientos = movimientoRepository.findByFechaBetween(inicio, fin);

        double ingresos = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.INGRESO)
                .mapToDouble(MovimientoBancario::getImporte).sum();

        double gastos = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.GASTO)
                .mapToDouble(MovimientoBancario::getImporte).sum();

        return new ResumenEconomico(ingresos, gastos, ingresos - gastos);
    }

    // Informe detallado para declaración de renta
    public record DetalleInmueble(String inmuebleId, double ingresos, double gastos, double neto) {}
    public record DetalleConcepto(String concepto, double total) {}
    public record InformeDeclaracionRenta(
            int anio,
            double totalIngresos,
            double totalGastos,
            double balanceNeto,
            List<DetalleInmueble> desglosePorInmueble,
            List<DetalleConcepto> desglosePorTipoGasto,
            List<DetalleConcepto> desglosePorTipoIngreso
    ) {}

    public InformeDeclaracionRenta informeDeclaracionRenta(int anio) {
        LocalDate inicio = LocalDate.of(anio, 1, 1);
        LocalDate fin = LocalDate.of(anio, 12, 31);
        List<MovimientoBancario> movimientos = movimientoRepository.findByFechaBetween(inicio, fin);

        double totalIngresos = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.INGRESO)
                .mapToDouble(MovimientoBancario::getImporte).sum();

        double totalGastos = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.GASTO)
                .mapToDouble(MovimientoBancario::getImporte).sum();

        // Desglose por inmueble
        Map<String, List<MovimientoBancario>> porInmueble = movimientos.stream()
                .filter(m -> m.getInmuebleId() != null)
                .collect(Collectors.groupingBy(MovimientoBancario::getInmuebleId));

        List<DetalleInmueble> desglosePorInmueble = porInmueble.entrySet().stream()
                .map(entry -> {
                    double ing = entry.getValue().stream()
                            .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.INGRESO)
                            .mapToDouble(MovimientoBancario::getImporte).sum();
                    double gas = entry.getValue().stream()
                            .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.GASTO)
                            .mapToDouble(MovimientoBancario::getImporte).sum();
                    return new DetalleInmueble(entry.getKey(), ing, gas, ing - gas);
                })
                .sorted(Comparator.comparing(DetalleInmueble::inmuebleId))
                .collect(Collectors.toList());

        // Desglose por tipo de gasto
        List<DetalleConcepto> desglosePorTipoGasto = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.GASTO)
                .collect(Collectors.groupingBy(m -> m.getConcepto() != null ? m.getConcepto() : "SIN_CONCEPTO",
                        Collectors.summingDouble(MovimientoBancario::getImporte)))
                .entrySet().stream()
                .map(e -> new DetalleConcepto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(DetalleConcepto::concepto))
                .collect(Collectors.toList());

        // Desglose por tipo de ingreso
        List<DetalleConcepto> desglosePorTipoIngreso = movimientos.stream()
                .filter(m -> m.getTipo() == MovimientoBancario.TipoMovimiento.INGRESO)
                .collect(Collectors.groupingBy(m -> m.getConcepto() != null ? m.getConcepto() : "SIN_CONCEPTO",
                        Collectors.summingDouble(MovimientoBancario::getImporte)))
                .entrySet().stream()
                .map(e -> new DetalleConcepto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(DetalleConcepto::concepto))
                .collect(Collectors.toList());

        return new InformeDeclaracionRenta(anio, totalIngresos, totalGastos,
                totalIngresos - totalGastos, desglosePorInmueble,
                desglosePorTipoGasto, desglosePorTipoIngreso);
    }
}
