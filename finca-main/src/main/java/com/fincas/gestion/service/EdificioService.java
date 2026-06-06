package com.fincas.gestion.service;

import com.fincas.gestion.dto.EdificioResponseDTO;
import com.fincas.gestion.dto.LocalResponseDTO;
import com.fincas.gestion.dto.PisoResponseDTO;
import com.fincas.gestion.model.Edificio;
import com.fincas.gestion.repository.EdificioRepository;
import com.fincas.gestion.repository.LocalRepository;
import com.fincas.gestion.repository.PisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EdificioService {

    @Autowired
    private EdificioRepository edificioRepository;

    @Autowired
    private PisoRepository pisoRepository;

    @Autowired
    private LocalRepository localRepository;

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

    public Optional<EdificioResponseDTO> actualizar(String id, Edificio datos) {
        return edificioRepository.findById(id).filter(Edificio::isActivo).map(edificio -> {
            edificio.setNombreEdificio(datos.getNombreEdificio());
            edificio.setDireccion(datos.getDireccion());
            edificio.setNumero(datos.getNumero());
            edificio.setCodigoPostal(datos.getCodigoPostal());
            edificio.setCiudad(datos.getCiudad());
            edificio.setProvincia(datos.getProvincia());
            edificio.setReferenciaCatastral(datos.getReferenciaCatastral());
            edificio.setSuperficieM2(datos.getSuperficieM2());
            edificio.setTotalPlantas(datos.getTotalPlantas());
            edificio.setInquilinoId(datos.getInquilinoId() != null && !datos.getInquilinoId().isBlank() ? datos.getInquilinoId() : null);
            edificio.setRentaMensual(datos.getRentaMensual());
            return new EdificioResponseDTO(edificioRepository.save(edificio));
        });
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

    // Listado de pisos y locales de un edificio
    public List<PisoResponseDTO> listarPisosPorEdificio(String edificioId) {
        return pisoRepository.findByEdificioIdAndActivoTrue(edificioId).stream()
                .map(PisoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<LocalResponseDTO> listarLocalesPorEdificio(String edificioId) {
        return localRepository.findByEdificioIdAndActivoTrue(edificioId).stream()
                .map(LocalResponseDTO::new)
                .collect(Collectors.toList());
    }
}
