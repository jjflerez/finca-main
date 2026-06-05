package com.fincas.gestion.model;

import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
public class Local extends Inmueble {

    public enum UsoLocal { COMERCIAL, OFICINA, ALMACEN, HOSTELERIA, OTRO }

    private String edificioId;
    private int numeroLocal;
    private UsoLocal usoLocal;
    private boolean gestionadoPorEmpresa;
    private String inquilinoId;
    private LocalDate fechaInicioContrato;
    private LocalDate fechaFinContrato;
    private double rentaMensual;
    private boolean tieneIVA;

    public Local() {
    }

    public Local(String id, String direccion, String numero, String codigoPostal,
                 String ciudad, String provincia, String referenciaCatastral,
                 double superficieM2, String edificioId, int numeroLocal,
                 UsoLocal usoLocal, boolean gestionadoPorEmpresa, double rentaMensual, boolean tieneIVA) {
        super(id, direccion, numero, codigoPostal, ciudad, provincia, referenciaCatastral, superficieM2);
        this.edificioId = edificioId;
        this.numeroLocal = numeroLocal;
        this.usoLocal = usoLocal;
        this.gestionadoPorEmpresa = gestionadoPorEmpresa;
        this.inquilinoId = null;
        this.rentaMensual = rentaMensual;
        this.tieneIVA = tieneIVA;
    }

    @Override
    public String getTipoInmueble() {
        return "LOCAL";
    }

    public boolean isAlquilado() {
        return inquilinoId != null && !inquilinoId.isEmpty();
    }

    public double getRentaConIVA() {
        return tieneIVA ? rentaMensual * 1.21 : rentaMensual;
    }

    @Override
    public String toString() {
        String estado = isAlquilado() ? "ALQUILADO a " + inquilinoId : "LIBRE";
        return super.toString() + " | Local " + numeroLocal + " (" + usoLocal + ") | " + estado
                + " | Renta: " + rentaMensual + "€" + (tieneIVA ? " (+IVA)" : "");
    }

    public String getEdificioId() {
        return edificioId;
    }

    public void setEdificioId(String edificioId) {
        this.edificioId = edificioId;
    }

    public int getNumeroLocal() {
        return numeroLocal;
    }

    public void setNumeroLocal(int numeroLocal) {
        this.numeroLocal = numeroLocal;
    }

    public UsoLocal getUsoLocal() {
        return usoLocal;
    }

    public void setUsoLocal(UsoLocal usoLocal) {
        this.usoLocal = usoLocal;
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

    public boolean isTieneIVA() {
        return tieneIVA;
    }

    public void setTieneIVA(boolean tieneIVA) {
        this.tieneIVA = tieneIVA;
    }
}
