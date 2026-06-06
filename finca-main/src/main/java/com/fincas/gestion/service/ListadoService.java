package com.fincas.gestion.service;

import com.fincas.gestion.model.Inquilino;
import com.fincas.gestion.model.Recibo;
import com.fincas.gestion.repository.InquilinoRepository;
import com.fincas.gestion.repository.ReciboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio para generar los listados que requiere el secretario
 * según el enunciado del proyecto.
 */
@Service
public class ListadoService {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    @Autowired
    private ReciboRepository reciboRepository;

    /**
     * Listado de inquilinos que han pagado (o no) en un determinado intervalo de tiempo.
     * Se basa en si tienen recibos cobrados (pagado=true) o pendientes (pagado=false)
     * en el rango de fechas dado.
     */
    public List<Inquilino> inquilinosPorEstadoPago(LocalDate desde, LocalDate hasta, boolean pagado) {
        List<Recibo> recibos = reciboRepository.findByCobradoAndFechaEmisionBetween(pagado, desde, hasta);

        // Obtener DNIs únicos
        Set<String> dnis = recibos.stream()
                .map(Recibo::getInquilinoDni)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Cargar los inquilinos correspondientes
        return dnis.stream()
                .map(dni -> inquilinoRepository.findById(dni).orElse(null))
                .filter(Objects::nonNull)
                .filter(Inquilino::isActivo)
                .sorted(Comparator.comparing(Inquilino::getNombre))
                .collect(Collectors.toList());
    }

    /**
     * Listado de todos los recibos cobrados en un rango de tiempo.
     */
    public List<Recibo> recibosCobradosEnRango(LocalDate desde, LocalDate hasta) {
        return reciboRepository.findByCobradoTrueAndFechaEmisionBetween(desde, hasta);
    }

    /**
     * Listado de todos los recibos (cobrados y pendientes) en un rango de tiempo.
     */
    public List<Recibo> recibosEnRango(LocalDate desde, LocalDate hasta) {
        return reciboRepository.findByFechaEmisionBetween(desde, hasta);
    }
}
