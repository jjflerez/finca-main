package com.fincas.gestion.controller;

import com.fincas.gestion.dto.InmuebleResponseDTO;
import com.fincas.gestion.service.InmuebleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inmuebles")
public class InmuebleController {

    private final InmuebleService inmuebleService;

    public InmuebleController(InmuebleService inmuebleService) {
        this.inmuebleService = inmuebleService;
    }

    @GetMapping
    public List<InmuebleResponseDTO> listarTodos() {
        return inmuebleService.listarTodosActivos();
    }
}
