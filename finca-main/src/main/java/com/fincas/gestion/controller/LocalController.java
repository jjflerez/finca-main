package com.fincas.gestion.controller;

import com.fincas.gestion.dto.LocalResponseDTO;
import com.fincas.gestion.model.Local;
import com.fincas.gestion.service.LocalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locales")
public class LocalController {

    private final LocalService localService;

    public LocalController(LocalService localService) {
        this.localService = localService;
    }

    @GetMapping
    public List<LocalResponseDTO> listarTodos() {
        return localService.listarTodos();
    }

    @GetMapping("/libres")
    public List<LocalResponseDTO> listarLibres() {
        return localService.listarLibres();
    }

    @PostMapping
    public LocalResponseDTO crear(@RequestBody Local local) {
        return localService.crear(local);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        try {
            boolean eliminado = localService.eliminarLogico(id);
            if (eliminado) {
                return ResponseEntity.ok("Local eliminado correctamente.");
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
