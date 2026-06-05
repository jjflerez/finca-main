package com.fincas.gestion.service;

import com.fincas.gestion.model.*;
import com.fincas.gestion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AlquilerService {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    @Autowired
    private PisoRepository pisoRepository;

    @Autowired
    private LocalRepository localRepository;

    public record AlquilerRequest(String inmuebleId, String inquilinoDni, String tipoInmueble,
                                   java.time.LocalDate fechaInicio, java.time.LocalDate fechaFin,
                                   double rentaMensual) {}

    public record AlquilerResult(boolean exito, String mensaje) {}

    public AlquilerResult alquilar(AlquilerRequest req) {
        // Verificar que el inquilino existe y puede alquilar
        Optional<Inquilino> optInquilino = inquilinoRepository.findById(req.inquilinoDni());
        if (optInquilino.isEmpty() || !optInquilino.get().isActivo()) {
            return new AlquilerResult(false, "Inquilino no encontrado o inactivo.");
        }
        if (!optInquilino.get().puedeAlquilar()) {
            return new AlquilerResult(false, "El inquilino no cumple los requisitos (nómina, aval bancario, contrato de trabajo o avalista).");
        }

        if ("PISO".equalsIgnoreCase(req.tipoInmueble())) {
            return pisoRepository.findById(req.inmuebleId()).map(piso -> {
                if (piso.getInquilinoId() != null && !piso.getInquilinoId().isEmpty()) {
                    return new AlquilerResult(false, "El piso ya está alquilado.");
                }
                piso.setInquilinoId(req.inquilinoDni());
                piso.setFechaInicioContrato(req.fechaInicio());
                piso.setFechaFinContrato(req.fechaFin());
                piso.setRentaMensual(req.rentaMensual());
                pisoRepository.save(piso);
                return new AlquilerResult(true, "Piso alquilado correctamente.");
            }).orElse(new AlquilerResult(false, "Piso no encontrado."));
        }

        if ("LOCAL".equalsIgnoreCase(req.tipoInmueble())) {
            return localRepository.findById(req.inmuebleId()).map(local -> {
                if (local.getInquilinoId() != null && !local.getInquilinoId().isEmpty()) {
                    return new AlquilerResult(false, "El local ya está alquilado.");
                }
                local.setInquilinoId(req.inquilinoDni());
                local.setFechaInicioContrato(req.fechaInicio());
                local.setFechaFinContrato(req.fechaFin());
                local.setRentaMensual(req.rentaMensual());
                localRepository.save(local);
                return new AlquilerResult(true, "Local alquilado correctamente.");
            }).orElse(new AlquilerResult(false, "Local no encontrado."));
        }

        return new AlquilerResult(false, "Tipo de inmueble no válido. Use PISO o LOCAL.");
    }

    public AlquilerResult desalquilar(String inmuebleId, String tipoInmueble) {
        if ("PISO".equalsIgnoreCase(tipoInmueble)) {
            return pisoRepository.findById(inmuebleId).map(piso -> {
                if (piso.getInquilinoId() == null || piso.getInquilinoId().isEmpty()) {
                    return new AlquilerResult(false, "El piso no está alquilado.");
                }
                piso.setInquilinoId(null);
                piso.setFechaInicioContrato(null);
                piso.setFechaFinContrato(null);
                pisoRepository.save(piso);
                return new AlquilerResult(true, "Piso desalquilado correctamente.");
            }).orElse(new AlquilerResult(false, "Piso no encontrado."));
        }

        if ("LOCAL".equalsIgnoreCase(tipoInmueble)) {
            return localRepository.findById(inmuebleId).map(local -> {
                if (local.getInquilinoId() == null || local.getInquilinoId().isEmpty()) {
                    return new AlquilerResult(false, "El local no está alquilado.");
                }
                local.setInquilinoId(null);
                local.setFechaInicioContrato(null);
                local.setFechaFinContrato(null);
                localRepository.save(local);
                return new AlquilerResult(true, "Local desalquilado correctamente.");
            }).orElse(new AlquilerResult(false, "Local no encontrado."));
        }

        return new AlquilerResult(false, "Tipo de inmueble no válido.");
    }
}
