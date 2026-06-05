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
import java.util.List;
import java.util.Optional;

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

    // --- Cuentas ---
    public List<CuentaBancaria> listarCuentasPorBanco(Long bancoId) {
        return cuentaRepository.findByBancoId(bancoId);
    }

    public CuentaBancaria crearCuenta(Long bancoId, CuentaBancaria cuenta) {
        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new RuntimeException("Banco no encontrado"));
        cuenta.setBanco(banco);
        return cuentaRepository.save(cuenta);
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

    // Resumen económico para declaración de la renta
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
}
