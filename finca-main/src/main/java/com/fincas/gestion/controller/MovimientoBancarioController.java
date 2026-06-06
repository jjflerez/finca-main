package com.fincas.gestion.controller;

import com.fincas.gestion.model.Banco;
import com.fincas.gestion.model.CuentaBancaria;
import com.fincas.gestion.model.MovimientoBancario;
import com.fincas.gestion.model.TipoMovimiento;
import com.fincas.gestion.service.MovimientoBancarioService;
import com.fincas.gestion.service.MovimientoBancarioService.ResumenEconomico;
import com.fincas.gestion.service.MovimientoBancarioService.InformeDeclaracionRenta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MovimientoBancarioController {

    @Autowired
    private MovimientoBancarioService service;

    // --- Bancos ---
    @GetMapping("/bancos")
    public List<Banco> listarBancos() { return service.listarBancos(); }

    @GetMapping("/bancos/{id}")
    public ResponseEntity<Banco> obtenerBanco(@PathVariable Long id) {
        return service.obtenerBanco(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/bancos")
    public Banco crearBanco(@RequestBody Banco banco) { return service.crearBanco(banco); }

    @PutMapping("/bancos/{id}")
    public ResponseEntity<Banco> actualizarBanco(@PathVariable Long id, @RequestBody Banco datos) {
        return service.actualizarBanco(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/bancos/{id}")
    public ResponseEntity<Void> eliminarBanco(@PathVariable Long id) {
        service.eliminarBanco(id);
        return ResponseEntity.ok().build();
    }

    // --- Cuentas ---
    @GetMapping("/cuentas")
    public List<CuentaBancaria> listarTodasCuentas() {
        return service.listarTodasCuentas();
    }

    @GetMapping("/bancos/{id}/cuentas")
    public List<CuentaBancaria> listarCuentas(@PathVariable Long id) {
        return service.listarCuentasPorBanco(id);
    }

    @GetMapping("/cuentas/{id}")
    public ResponseEntity<CuentaBancaria> obtenerCuenta(@PathVariable Long id) {
        return service.obtenerCuenta(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/bancos/{id}/cuentas")
    public CuentaBancaria crearCuenta(@PathVariable Long id, @RequestBody CuentaBancaria cuenta) {
        return service.crearCuenta(id, cuenta);
    }

    @PutMapping("/cuentas/{id}")
    public ResponseEntity<CuentaBancaria> actualizarCuenta(@PathVariable Long id, @RequestBody CuentaBancaria datos) {
        return service.actualizarCuenta(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/cuentas/{id}")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable Long id) {
        service.eliminarCuenta(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cuentas/inmueble/{inmuebleId}")
    public List<CuentaBancaria> listarCuentasPorInmueble(@PathVariable String inmuebleId) {
        return service.listarCuentasPorInmueble(inmuebleId);
    }

    // --- Movimientos ---
    @GetMapping("/movimientos")
    public List<MovimientoBancario> listarTodos() { return service.listarTodos(); }

    @GetMapping("/movimientos/cuenta/{cuentaId}")
    public List<MovimientoBancario> listarPorCuenta(@PathVariable Long cuentaId) {
        return service.listarPorCuenta(cuentaId);
    }

    @GetMapping("/movimientos/inmueble/{inmuebleId}")
    public List<MovimientoBancario> listarPorInmueble(@PathVariable String inmuebleId) {
        return service.listarPorInmueble(inmuebleId);
    }

    @GetMapping("/movimientos/rango")
    public List<MovimientoBancario> listarPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return service.listarPorRangoFecha(desde, hasta);
    }

    @GetMapping("/movimientos/tipo/{tipo}")
    public List<MovimientoBancario> listarPorTipo(@PathVariable String tipo) {
        MovimientoBancario.TipoMovimiento t = MovimientoBancario.TipoMovimiento.valueOf(tipo.toUpperCase());
        return service.listarPorTipo(t);
    }

    @PostMapping("/movimientos")
    public MovimientoBancario registrar(@RequestBody MovimientoBancario movimiento) {
        return service.registrar(movimiento);
    }

    // --- Tipos de gasto/ingreso estandarizados ---
    @GetMapping("/tipos-gasto")
    public String[] listarTiposGasto() {
        return TipoMovimiento.TIPOS_GASTO;
    }

    @GetMapping("/tipos-ingreso")
    public String[] listarTiposIngreso() {
        return TipoMovimiento.TIPOS_INGRESO;
    }

    // --- Informes para declaración de renta ---
    @GetMapping("/informes/resumen-anual/{anio}")
    public ResponseEntity<ResumenEconomico> resumenAnual(@PathVariable int anio) {
        return ResponseEntity.ok(service.resumenAnual(anio));
    }

    @GetMapping("/informes/declaracion-renta/{anio}")
    public ResponseEntity<InformeDeclaracionRenta> informeDeclaracionRenta(@PathVariable int anio) {
        return ResponseEntity.ok(service.informeDeclaracionRenta(anio));
    }
}
