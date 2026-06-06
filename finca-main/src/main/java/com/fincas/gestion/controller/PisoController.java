package com.fincas.gestion.controller;

import com.fincas.gestion.dto.PisoResponseDTO;
import com.fincas.gestion.model.Piso;
import com.fincas.gestion.service.PisoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pisos")
public class PisoController {

    private final PisoService pisoService;

    public PisoController(PisoService pisoService) {
        this.pisoService = pisoService;
    }

    @GetMapping
    public List<PisoResponseDTO> listarTodos() {
        return pisoService.listarTodos();
    }

    @GetMapping("/libres")
    public List<PisoResponseDTO> listarLibres() {
        return pisoService.listarLibres();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PisoResponseDTO> obtenerPorId(@PathVariable String id) {
        return pisoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PisoResponseDTO crear(@RequestBody Piso piso) {
        return pisoService.crear(piso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PisoResponseDTO> actualizar(@PathVariable String id, @RequestBody Piso datos) {
        return pisoService.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        try {
            boolean eliminado = pisoService.eliminarLogico(id);
            if (eliminado) {
                return ResponseEntity.ok("Piso eliminado correctamente.");
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
