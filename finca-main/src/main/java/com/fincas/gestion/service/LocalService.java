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

    public Optional<LocalResponseDTO> obtenerPorId(String id) {
        return localRepository.findById(id).filter(Local::isActivo).map(LocalResponseDTO::new);
    }

    public LocalResponseDTO crear(Local local) {
        local.setActivo(true);
        Local guardado = localRepository.save(local);
        return new LocalResponseDTO(guardado);
    }

    public Optional<LocalResponseDTO> actualizar(String id, Local datos) {
        return localRepository.findById(id).filter(Local::isActivo).map(local -> {
            local.setDireccion(datos.getDireccion());
            local.setNumero(datos.getNumero());
            local.setCodigoPostal(datos.getCodigoPostal());
            local.setCiudad(datos.getCiudad());
            local.setProvincia(datos.getProvincia());
            local.setReferenciaCatastral(datos.getReferenciaCatastral());
            local.setSuperficieM2(datos.getSuperficieM2());
            local.setEdificioId(datos.getEdificioId());
            local.setNumeroLocal(datos.getNumeroLocal());
            if (datos.getUsoLocal() != null) {
                local.setUsoLocal(datos.getUsoLocal());
            }
            local.setGestionadoPorEmpresa(datos.isGestionadoPorEmpresa());
            local.setRentaMensual(datos.getRentaMensual());
            local.setTieneIVA(datos.isTieneIVA());
            local.setInquilinoId(datos.getInquilinoId() != null && !datos.getInquilinoId().isBlank() ? datos.getInquilinoId() : null);
            return new LocalResponseDTO(localRepository.save(local));
        });
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
