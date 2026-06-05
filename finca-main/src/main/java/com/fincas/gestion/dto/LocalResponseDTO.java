package com.fincas.gestion.dto;

import com.fincas.gestion.model.Local;

public class LocalResponseDTO {
    private String id;
    private String tipo;
    private String direccion;
    private String numero;
    private double superficieM2;
    private String edificioId;
    private int numeroLocal;
    private String usoLocal;
    private boolean gestionadoPorEmpresa;
    private double rentaMensual;
    private boolean tieneIVA;
    private String inquilinoId;
    private String estado;

    public LocalResponseDTO() {}

    public LocalResponseDTO(Local l) {
        this.id = l.getId();
        this.tipo = l.getTipoInmueble();
        this.direccion = l.getDireccion();
        this.numero = l.getNumero();
        this.superficieM2 = l.getSuperficieM2();
        this.edificioId = l.getEdificioId();
        this.numeroLocal = l.getNumeroLocal();
        this.usoLocal = l.getUsoLocal() != null ? l.getUsoLocal().name() : "";
        this.gestionadoPorEmpresa = l.isGestionadoPorEmpresa();
        this.rentaMensual = l.getRentaMensual();
        this.tieneIVA = l.isTieneIVA();
        this.inquilinoId = l.getInquilinoId();
        this.estado = l.isAlquilado() ? "ALQUILADO" : "LIBRE";
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public double getSuperficieM2() { return superficieM2; }
    public void setSuperficieM2(double superficieM2) { this.superficieM2 = superficieM2; }
    public String getEdificioId() { return edificioId; }
    public void setEdificioId(String edificioId) { this.edificioId = edificioId; }
    public int getNumeroLocal() { return numeroLocal; }
    public void setNumeroLocal(int numeroLocal) { this.numeroLocal = numeroLocal; }
    public String getUsoLocal() { return usoLocal; }
    public void setUsoLocal(String usoLocal) { this.usoLocal = usoLocal; }
    public boolean isGestionadoPorEmpresa() { return gestionadoPorEmpresa; }
    public void setGestionadoPorEmpresa(boolean gestionadoPorEmpresa) { this.gestionadoPorEmpresa = gestionadoPorEmpresa; }
    public double getRentaMensual() { return rentaMensual; }
    public void setRentaMensual(double rentaMensual) { this.rentaMensual = rentaMensual; }
    public boolean isTieneIVA() { return tieneIVA; }
    public void setTieneIVA(boolean tieneIVA) { this.tieneIVA = tieneIVA; }
    public String getInquilinoId() { return inquilinoId; }
    public void setInquilinoId(String inquilinoId) { this.inquilinoId = inquilinoId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
