package com.fincas.gestion.controller;

import com.fincas.gestion.model.Banco;
import com.fincas.gestion.model.CuentaBancaria;
import com.fincas.gestion.model.MovimientoBancario;
import com.fincas.gestion.service.MovimientoBancarioService;
import com.fincas.gestion.service.MovimientoBancarioService.ResumenEconomico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MovimientoBancarioController {

    @Autowired
    private MovimientoBancarioService service;

    // --- Bancos ---
    @GetMapping("/bancos")
    public List<Banco> listarBancos() { return service.listarBancos(); }

    @PostMapping("/bancos")
    public Banco crearBanco(@RequestBody Banco banco) { return service.crearBanco(banco); }

    @GetMapping("/bancos/{id}/cuentas")
    public List<CuentaBancaria> listarCuentas(@PathVariable Long id) {
        return service.listarCuentasPorBanco(id);
    }

    @PostMapping("/bancos/{id}/cuentas")
    public CuentaBancaria crearCuenta(@PathVariable Long id, @RequestBody CuentaBancaria cuenta) {
        return service.crearCuenta(id, cuenta);
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

    @PostMapping("/movimientos")
    public MovimientoBancario registrar(@RequestBody MovimientoBancario movimiento) {
        return service.registrar(movimiento);
    }

    // --- Informe para declaración de renta ---
    @GetMapping("/informes/resumen-anual/{anio}")
    public ResponseEntity<ResumenEconomico> resumenAnual(@PathVariable int anio) {
        return ResponseEntity.ok(service.resumenAnual(anio));
    }
}
