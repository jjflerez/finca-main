package com.fincas.gestion.service;

import com.fincas.gestion.dto.InmuebleResponseDTO;
import com.fincas.gestion.model.Edificio;
import com.fincas.gestion.model.Inmueble;
import com.fincas.gestion.model.Local;
import com.fincas.gestion.model.Piso;
import com.fincas.gestion.repository.InmuebleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InmuebleService {

    @Autowired
    private InmuebleRepository inmuebleRepository;

    public List<InmuebleResponseDTO> listarTodosActivos() {
        return inmuebleRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private InmuebleResponseDTO mapToDTO(Inmueble inmueble) {
        InmuebleResponseDTO dto = new InmuebleResponseDTO();
        dto.setId(inmueble.getId());
        dto.setTipo(inmueble.getTipoInmueble());
        dto.setDireccionCompleta(inmueble.getDireccionCompleta());
        dto.setSuperficieM2(inmueble.getSuperficieM2());

        if (inmueble instanceof Piso) {
            Piso p = (Piso) inmueble;
            dto.setEdificioId(p.getEdificioId());
            dto.setEstado(p.isAlquilado() ? "ALQUILADO" : "LIBRE");
        } else if (inmueble instanceof Local) {
            Local l = (Local) inmueble;
            dto.setEdificioId(l.getEdificioId());
            dto.setEstado(l.isAlquilado() ? "ALQUILADO" : "LIBRE");
        } else if (inmueble instanceof Edificio) {
            dto.setEstado("EDIFICIO PRINCIPAL");
            dto.setEdificioId(null);
        }

        return dto;
    }
}
