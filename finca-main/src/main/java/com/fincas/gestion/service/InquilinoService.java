package com.fincas.gestion.service;

import com.fincas.gestion.model.Inquilino;
import com.fincas.gestion.repository.InquilinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InquilinoService {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    public List<Inquilino> listarTodos() {
        return inquilinoRepository.findByActivoTrue();
    }

    public List<Inquilino> listarOrdenadosPorFecha() {
        return inquilinoRepository.findByActivoTrueOrderByFechaAltaAsc();
    }

    public List<Inquilino> listarPorRangoFecha(LocalDate desde, LocalDate hasta) {
        return inquilinoRepository.findByActivoTrueAndFechaAltaBetween(desde, hasta);
    }

    public Optional<Inquilino> obtenerPorDni(String dni) {
        return inquilinoRepository.findById(dni).filter(Inquilino::isActivo);
    }

    public Inquilino crear(Inquilino inquilino) {
        if (inquilino.getFechaAlta() == null) {
            inquilino.setFechaAlta(LocalDate.now());
        }
        inquilino.setActivo(true);
        return inquilinoRepository.save(inquilino);
    }

    public Optional<Inquilino> actualizar(String dni, Inquilino datos) {
        return inquilinoRepository.findById(dni).filter(Inquilino::isActivo).map(inquilino -> {
            inquilino.setNombre(datos.getNombre());
            inquilino.setApellidos(datos.getApellidos());
            inquilino.setEdad(datos.getEdad());
            inquilino.setSexo(datos.getSexo());
            inquilino.setTelefono(datos.getTelefono());
            inquilino.setEmail(datos.getEmail());
            inquilino.setFotografia(datos.getFotografia());
            inquilino.setTieneNomina(datos.isTieneNomina());
            inquilino.setTieneAvalBancario(datos.isTieneAvalBancario());
            inquilino.setTieneContratoTrabajo(datos.isTieneContratoTrabajo());
            inquilino.setAvalistaDni(datos.getAvalistaDni());
            return inquilinoRepository.save(inquilino);
        });
    }

    public boolean eliminarLogico(String dni) {
        return inquilinoRepository.findById(dni).filter(Inquilino::isActivo).map(inquilino -> {
            inquilino.setActivo(false);
            inquilinoRepository.save(inquilino);
            return true;
        }).orElse(false);
    }

    public boolean puedeAlquilar(String dni) {
        return inquilinoRepository.findById(dni)
                .filter(Inquilino::isActivo)
                .map(Inquilino::puedeAlquilar)
                .orElse(false);
    }
}
