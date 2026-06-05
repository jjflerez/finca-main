package com.fincas.gestion.controller;

import com.fincas.gestion.service.AlquilerService;
import com.fincas.gestion.service.AlquilerService.AlquilerRequest;
import com.fincas.gestion.service.AlquilerService.AlquilerResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/alquiler")
public class AlquilerController {

    @Autowired
    private AlquilerService alquilerService;

    @PostMapping("/alquilar")
    public ResponseEntity<AlquilerResult> alquilar(@RequestBody AlquilerRequest request) {
        AlquilerResult resultado = alquilerService.alquilar(request);
        if (resultado.exito()) {
            return ResponseEntity.ok(resultado);
        }
        return ResponseEntity.badRequest().body(resultado);
    }

    @PostMapping("/desalquilar")
    public ResponseEntity<AlquilerResult> desalquilar(@RequestBody Map<String, String> body) {
        String inmuebleId = body.get("inmuebleId");
        String tipoInmueble = body.get("tipoInmueble");
        AlquilerResult resultado = alquilerService.desalquilar(inmuebleId, tipoInmueble);
        if (resultado.exito()) {
            return ResponseEntity.ok(resultado);
        }
        return ResponseEntity.badRequest().body(resultado);
    }
}
