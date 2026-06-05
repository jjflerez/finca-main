package com.fincas.gestion.controller;

import com.fincas.gestion.model.Recibo;
import com.fincas.gestion.service.ReciboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recibos")
public class ReciboController {

    @Autowired
    private ReciboService reciboService;

    @GetMapping
    public List<Recibo> listarTodos() {
        return reciboService.listarTodos();
    }

    @GetMapping("/inmueble/{inmuebleId}")
    public List<Recibo> listarPorInmueble(@PathVariable String inmuebleId) {
        return reciboService.listarPorInmueble(inmuebleId);
    }

    @GetMapping("/pendientes")
    public List<Recibo> listarPendientes() {
        return reciboService.listarPendientes();
    }

    @GetMapping("/pendientes/rango")
    public List<Recibo> listarPendientesEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return reciboService.listarPendientesEnRango(desde, hasta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recibo> obtenerPorId(@PathVariable Long id) {
        return reciboService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Recibo> crear(@RequestBody Recibo recibo) {
        return ResponseEntity.ok(reciboService.crear(recibo));
    }

    @PostMapping("/copiar-mes-anterior/{inmuebleId}")
    public ResponseEntity<Recibo> copiarMesAnterior(@PathVariable String inmuebleId) {
        return reciboService.copiarMesAnterior(inmuebleId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recibo> actualizar(@PathVariable Long id, @RequestBody Recibo datos) {
        return reciboService.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/cobrar")
    public ResponseEntity<Recibo> marcarCobrado(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean cobrado = body.getOrDefault("cobrado", true);
        return reciboService.marcarCobrado(id, cobrado)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reciboService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
