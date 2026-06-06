package com.fincas.gestion.controller;

import com.fincas.gestion.model.Usuario;
import com.fincas.gestion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public record LoginRequest(String username, String password) {}
    public record LoginResponse(boolean success, String message, String username, String rol) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Optional<Usuario> userOpt = usuarioRepository.findByUsername(request.username());

        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            // Para un proyecto real aquí se usaría BCrypt. Aquí comparamos texto plano por simplicidad
            if (user.getPassword().equals(request.password())) {
                return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", user.getUsername(), user.getRol()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new LoginResponse(false, "Credenciales inválidas", null, null));
    }
}
