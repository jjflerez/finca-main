package com.fincas.gestion.controller;

import com.fincas.gestion.model.Inquilino;
import com.fincas.gestion.service.InquilinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquilinos")
public class InquilinoController {

    @Autowired
    private InquilinoService inquilinoService;

    @GetMapping
    public List<Inquilino> listarTodos() {
        return inquilinoService.listarTodos();
    }

    @GetMapping("/ordenados-por-fecha")
    public List<Inquilino> listarPorFecha() {
        return inquilinoService.listarOrdenadosPorFecha();
    }

    @GetMapping("/rango-fecha")
    public List<Inquilino> listarPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return inquilinoService.listarPorRangoFecha(desde, hasta);
    }

    @GetMapping("/{dni}")
    public ResponseEntity<Inquilino> obtenerPorDni(@PathVariable String dni) {
        return inquilinoService.obtenerPorDni(dni)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{dni}/puede-alquilar")
    public ResponseEntity<Map<String, Boolean>> puedeAlquilar(@PathVariable String dni) {
        boolean puede = inquilinoService.puedeAlquilar(dni);
        return ResponseEntity.ok(Map.of("puedeAlquilar", puede));
    }

    @PostMapping
    public ResponseEntity<Inquilino> crear(@RequestBody Inquilino inquilino) {
        return ResponseEntity.ok(inquilinoService.crear(inquilino));
    }

    @PutMapping("/{dni}")
    public ResponseEntity<Inquilino> actualizar(@PathVariable String dni, @RequestBody Inquilino datos) {
        return inquilinoService.actualizar(dni, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{dni}")
    public ResponseEntity<Void> eliminar(@PathVariable String dni) {
        if (inquilinoService.eliminarLogico(dni)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
