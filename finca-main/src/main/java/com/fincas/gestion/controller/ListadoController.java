package com.fincas.gestion.controller;

import com.fincas.gestion.model.Inquilino;
import com.fincas.gestion.model.Recibo;
import com.fincas.gestion.service.ListadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller para los listados que requiere el secretario.
 */
@RestController
@RequestMapping("/api/listados")
public class ListadoController {

    @Autowired
    private ListadoService listadoService;

    /**
     * Listado de inquilinos que han pagado o no en un intervalo de tiempo.
     * Ejemplo: GET /api/listados/inquilinos-pagos?desde=2026-01-01&hasta=2026-06-30&pagado=true
     */
    @GetMapping("/inquilinos-pagos")
    public List<Inquilino> inquilinosPorEstadoPago(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam boolean pagado) {
        return listadoService.inquilinosPorEstadoPago(desde, hasta, pagado);
    }

    /**
     * Listado de recibos cobrados en un rango de tiempo.
     */
    @GetMapping("/recibos-cobrados")
    public List<Recibo> recibosCobradosEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return listadoService.recibosCobradosEnRango(desde, hasta);
    }

    /**
     * Listado de todos los recibos en un rango de tiempo.
     */
    @GetMapping("/recibos-rango")
    public List<Recibo> recibosEnRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return listadoService.recibosEnRango(desde, hasta);
    }
}
