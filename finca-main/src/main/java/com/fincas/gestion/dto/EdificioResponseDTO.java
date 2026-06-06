package com.fincas.gestion.dto;

import com.fincas.gestion.model.Edificio;

import java.time.LocalDate;

public class EdificioResponseDTO {
    private String id;
    private String nombreEdificio;
    private String direccion;
    private String numero;
    private String codigoPostal;
    private String ciudad;
    private String provincia;
    private String referenciaCatastral;
    private double superficieM2;
    private int totalPlantas;
    private String inquilinoId;
    private String estado;
    private LocalDate fechaInicioContrato;
    private LocalDate fechaFinContrato;
    private double rentaMensual;

    public EdificioResponseDTO() {}

    public EdificioResponseDTO(Edificio e) {
        this.id = e.getId();
        this.nombreEdificio = e.getNombreEdificio();
        this.direccion = e.getDireccion();
        this.numero = e.getNumero();
        this.codigoPostal = e.getCodigoPostal();
        this.ciudad = e.getCiudad();
        this.provincia = e.getProvincia();
        this.referenciaCatastral = e.getReferenciaCatastral();
        this.superficieM2 = e.getSuperficieM2();
        this.totalPlantas = e.getTotalPlantas();
        this.inquilinoId = e.getInquilinoId();
        this.estado = e.isAlquilado() ? "ALQUILADO" : "LIBRE";
        this.fechaInicioContrato = e.getFechaInicioContrato();
        this.fechaFinContrato = e.getFechaFinContrato();
        this.rentaMensual = e.getRentaMensual();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombreEdificio() { return nombreEdificio; }
    public void setNombreEdificio(String nombreEdificio) { this.nombreEdificio = nombreEdificio; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getCodigoPostal() { return codigoPostal; }
    public void setCodigoPostal(String codigoPostal) { this.codigoPostal = codigoPostal; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }
    public String getReferenciaCatastral() { return referenciaCatastral; }
    public void setReferenciaCatastral(String referenciaCatastral) { this.referenciaCatastral = referenciaCatastral; }
    public double getSuperficieM2() { return superficieM2; }
    public void setSuperficieM2(double superficieM2) { this.superficieM2 = superficieM2; }
    public int getTotalPlantas() { return totalPlantas; }
    public void setTotalPlantas(int totalPlantas) { this.totalPlantas = totalPlantas; }
    public String getInquilinoId() { return inquilinoId; }
    public void setInquilinoId(String inquilinoId) { this.inquilinoId = inquilinoId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDate getFechaInicioContrato() { return fechaInicioContrato; }
    public void setFechaInicioContrato(LocalDate fechaInicioContrato) { this.fechaInicioContrato = fechaInicioContrato; }
    public LocalDate getFechaFinContrato() { return fechaFinContrato; }
    public void setFechaFinContrato(LocalDate fechaFinContrato) { this.fechaFinContrato = fechaFinContrato; }
    public double getRentaMensual() { return rentaMensual; }
    public void setRentaMensual(double rentaMensual) { this.rentaMensual = rentaMensual; }
}
