package com.fincas.gestion.service;

import com.fincas.gestion.dto.LocalResponseDTO;
import com.fincas.gestion.model.Local;
import com.fincas.gestion.repository.LocalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LocalService {

    @Autowired
    private LocalRepository localRepository;

    public List<LocalResponseDTO> listarTodos() {
        return localRepository.findByActivoTrue().stream()
                .map(LocalResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<LocalResponseDTO> listarLibres() {
        return localRepository.findByActivoTrueAndInquilinoIdIsNull().stream()
                .map(LocalResponseDTO::new)
                .collect(Collectors.toList());
    }

    public LocalResponseDTO crear(Local local) {
        local.setActivo(true);
        Local guardado = localRepository.save(local);
        return new LocalResponseDTO(guardado);
    }

    public boolean eliminarLogico(String id) {
        Optional<Local> opt = localRepository.findById(id);
        if (opt.isPresent()) {
            Local local = opt.get();
            if (local.isAlquilado()) {
                throw new IllegalStateException("No se puede eliminar un local con inquilino asociado.");
            }
            local.setActivo(false);
            localRepository.save(local);
            return true;
        }
        return false;
    }
}
