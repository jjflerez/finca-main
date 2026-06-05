package com.fincas.gestion.service;

import com.fincas.gestion.dto.PisoResponseDTO;
import com.fincas.gestion.model.Piso;
import com.fincas.gestion.repository.PisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PisoService {

    @Autowired
    private PisoRepository pisoRepository;

    public List<PisoResponseDTO> listarTodos() {
        return pisoRepository.findByActivoTrue().stream()
                .map(PisoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<PisoResponseDTO> listarLibres() {
        return pisoRepository.findByActivoTrueAndInquilinoIdIsNull().stream()
                .map(PisoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public PisoResponseDTO crear(Piso piso) {
        piso.setActivo(true);
        Piso guardado = pisoRepository.save(piso);
        return new PisoResponseDTO(guardado);
    }

    public boolean eliminarLogico(String id) {
        Optional<Piso> opt = pisoRepository.findById(id);
        if (opt.isPresent()) {
            Piso piso = opt.get();
            if (piso.isAlquilado()) {
                throw new IllegalStateException("No se puede eliminar un piso con inquilino asociado.");
            }
            piso.setActivo(false);
            pisoRepository.save(piso);
            return true;
        }
        return false;
    }
}
