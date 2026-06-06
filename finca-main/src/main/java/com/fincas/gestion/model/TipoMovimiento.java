package com.fincas.gestion.model;

/**
 * Tipos de gasto e ingreso estandarizados según el enunciado.
 */
public class TipoMovimiento {

    // Tipos de GASTO estipulados
    public static final String GASTO_REPARACION = "REPARACION";
    public static final String GASTO_LIMPIEZA = "LIMPIEZA";
    public static final String GASTO_SUELDOS = "SUELDOS";
    public static final String GASTO_SUMINISTROS = "SUMINISTROS";
    public static final String GASTO_SEGUROS = "SEGUROS";
    public static final String GASTO_IMPUESTOS = "IMPUESTOS";
    public static final String GASTO_COMUNIDAD = "COMUNIDAD";
    public static final String GASTO_MANTENIMIENTO = "MANTENIMIENTO";
    public static final String GASTO_OTROS = "OTROS_GASTO";

    // Tipos de INGRESO estipulados
    public static final String INGRESO_COBRO_RECIBO = "COBRO_RECIBO";
    public static final String INGRESO_FIANZA = "FIANZA";
    public static final String INGRESO_OTROS = "OTROS_INGRESO";

    public static final String[] TIPOS_GASTO = {
        GASTO_REPARACION, GASTO_LIMPIEZA, GASTO_SUELDOS, GASTO_SUMINISTROS,
        GASTO_SEGUROS, GASTO_IMPUESTOS, GASTO_COMUNIDAD, GASTO_MANTENIMIENTO, GASTO_OTROS
    };

    public static final String[] TIPOS_INGRESO = {
        INGRESO_COBRO_RECIBO, INGRESO_FIANZA, INGRESO_OTROS
    };
}
