package com.fincas.gestion.dto;

import com.fincas.gestion.model.Edificio;

public class EdificioResponseDTO {
    private String id;
    private String nombreEdificio;
    private String direccion;
    private String numero;
    private String ciudad;
    private int totalPlantas;

    public EdificioResponseDTO() {}

    public EdificioResponseDTO(Edificio e) {
        this.id = e.getId();
        this.nombreEdificio = e.getNombreEdificio();
        this.direccion = e.getDireccion();
        this.numero = e.getNumero();
        this.ciudad = e.getCiudad();
        this.totalPlantas = e.getTotalPlantas();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNombreEdificio() { return nombreEdificio; }
    public void setNombreEdificio(String nombreEdificio) { this.nombreEdificio = nombreEdificio; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public int getTotalPlantas() { return totalPlantas; }
    public void setTotalPlantas(int totalPlantas) { this.totalPlantas = totalPlantas; }
}
