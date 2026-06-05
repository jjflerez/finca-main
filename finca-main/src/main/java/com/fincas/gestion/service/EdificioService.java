package com.fincas.gestion.service;

import com.fincas.gestion.dto.EdificioResponseDTO;
import com.fincas.gestion.model.Edificio;
import com.fincas.gestion.repository.EdificioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EdificioService {

    @Autowired
    private EdificioRepository edificioRepository;

    public List<EdificioResponseDTO> listarTodos() {
        return edificioRepository.findByActivoTrue().stream()
                .map(EdificioResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<EdificioResponseDTO> obtenerPorId(String id) {
        return edificioRepository.findById(id).filter(Edificio::isActivo).map(EdificioResponseDTO::new);
    }

    public EdificioResponseDTO crear(Edificio edificio) {
        edificio.setActivo(true);
        Edificio guardado = edificioRepository.save(edificio);
        return new EdificioResponseDTO(guardado);
    }

    public boolean eliminarLogico(String id) {
        Optional<Edificio> opt = edificioRepository.findById(id);
        if (opt.isPresent()) {
            Edificio edificio = opt.get();
            edificio.setActivo(false);
            edificioRepository.save(edificio);
            return true;
        }
        return false;
    }
}
