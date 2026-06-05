package com.fincas.gestion.dto;

public class InmuebleResponseDTO {
    private String id;
    private String tipo;
    private String direccionCompleta;
    private String edificioId;
    private String estado;
    private double superficieM2;

    public InmuebleResponseDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDireccionCompleta() { return direccionCompleta; }
    public void setDireccionCompleta(String direccionCompleta) { this.direccionCompleta = direccionCompleta; }
    public String getEdificioId() { return edificioId; }
    public void setEdificioId(String edificioId) { this.edificioId = edificioId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public double getSuperficieM2() { return superficieM2; }
    public void setSuperficieM2(double superficieM2) { this.superficieM2 = superficieM2; }
}
