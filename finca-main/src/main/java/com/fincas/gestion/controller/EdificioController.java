package com.fincas.gestion.controller;

import com.fincas.gestion.dto.EdificioResponseDTO;
import com.fincas.gestion.model.Edificio;
import com.fincas.gestion.service.EdificioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/edificios")
public class EdificioController {

    private final EdificioService edificioService;

    public EdificioController(EdificioService edificioService) {
        this.edificioService = edificioService;
    }

    @GetMapping
    public List<EdificioResponseDTO> listarTodos() {
        return edificioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EdificioResponseDTO> obtenerPorId(@PathVariable String id) {
        return edificioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public EdificioResponseDTO crear(@RequestBody Edificio edificio) {
        return edificioService.crear(edificio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (edificioService.eliminarLogico(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
