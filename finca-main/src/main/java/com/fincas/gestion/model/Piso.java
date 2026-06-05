package com.fincas.gestion.model;

import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@DiscriminatorValue("PISO")
public class Piso extends Inmueble {

    private String edificioId;
    private int planta;
    private String puerta;
    private int habitaciones;
    private int banos;
    private boolean gestionadoPorEmpresa;
    private String inquilinoId;
    private LocalDate fechaInicioContrato;
    private LocalDate fechaFinContrato;
    private double rentaMensual;

    public Piso() {
    }

    public Piso(String id, String direccion, String numero, String codigoPostal,
                String ciudad, String provincia, String referenciaCatastral,
                double superficieM2, String edificioId, int planta, String puerta,
                int habitaciones, int banos, boolean gestionadoPorEmpresa, double rentaMensual) {
        super(id, direccion, numero, codigoPostal, ciudad, provincia, referenciaCatastral, superficieM2);
        this.edificioId = edificioId;
        this.planta = planta;
        this.puerta = puerta;
        this.habitaciones = habitaciones;
        this.banos = banos;
        this.gestionadoPorEmpresa = gestionadoPorEmpresa;
        this.inquilinoId = null;
        this.rentaMensual = rentaMensual;
    }

    @Override
    public String getTipoInmueble() {
        return "PISO";
    }

    public boolean isAlquilado() {
        return inquilinoId != null && !inquilinoId.isEmpty();
    }

    public String getIdentificacion() {
        return "Planta " + planta + ", Puerta " + puerta;
    }

    @Override
    public String toString() {
        String estado = isAlquilado() ? "ALQUILADO a " + inquilinoId : "LIBRE";
        return super.toString() + " | " + getIdentificacion() + " | " + estado + " | Renta: " + rentaMensual + "€";
    }

    public String getEdificioId() {
        return edificioId;
    }

    public void setEdificioId(String edificioId) {
        this.edificioId = edificioId;
    }

    public int getPlanta() {
        return planta;
    }

    public void setPlanta(int planta) {
        this.planta = planta;
    }

    public String getPuerta() {
        return puerta;
    }

    public void setPuerta(String puerta) {
        this.puerta = puerta;
    }

    public int getHabitaciones() {
        return habitaciones;
    }

    public void setHabitaciones(int habitaciones) {
        this.habitaciones = habitaciones;
    }

    public int getBanos() {
        return banos;
    }

    public void setBanos(int banos) {
        this.banos = banos;
    }

    public boolean isGestionadoPorEmpresa() {
        return gestionadoPorEmpresa;
    }

    public void setGestionadoPorEmpresa(boolean gestionadoPorEmpresa) {
        this.gestionadoPorEmpresa = gestionadoPorEmpresa;
    }

    public String getInquilinoId() {
        return inquilinoId;
    }

    public void setInquilinoId(String inquilinoId) {
        this.inquilinoId = inquilinoId;
    }

    public LocalDate getFechaInicioContrato() {
        return fechaInicioContrato;
    }

    public void setFechaInicioContrato(LocalDate fechaInicioContrato) {
        this.fechaInicioContrato = fechaInicioContrato;
    }

    public LocalDate getFechaFinContrato() {
        return fechaFinContrato;
    }

    public void setFechaFinContrato(LocalDate fechaFinContrato) {
        this.fechaFinContrato = fechaFinContrato;
    }

    public double getRentaMensual() {
        return rentaMensual;
    }

    public void setRentaMensual(double rentaMensual) {
        this.rentaMensual = rentaMensual;
    }
}
