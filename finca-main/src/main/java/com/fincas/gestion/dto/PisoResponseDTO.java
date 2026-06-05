package com.fincas.gestion.dto;

import com.fincas.gestion.model.Piso;

public class PisoResponseDTO {
    private String id;
    private String tipo;
    private String direccion;
    private String numero;
    private double superficieM2;
    private String edificioId;
    private int planta;
    private String puerta;
    private int habitaciones;
    private int banos;
    private boolean gestionadoPorEmpresa;
    private double rentaMensual;
    private String inquilinoId;
    private String estado;

    public PisoResponseDTO() {}

    public PisoResponseDTO(Piso p) {
        this.id = p.getId();
        this.tipo = p.getTipoInmueble();
        this.direccion = p.getDireccion();
        this.numero = p.getNumero();
        this.superficieM2 = p.getSuperficieM2();
        this.edificioId = p.getEdificioId();
        this.planta = p.getPlanta();
        this.puerta = p.getPuerta();
        this.habitaciones = p.getHabitaciones();
        this.banos = p.getBanos();
        this.gestionadoPorEmpresa = p.isGestionadoPorEmpresa();
        this.rentaMensual = p.getRentaMensual();
        this.inquilinoId = p.getInquilinoId();
        this.estado = p.isAlquilado() ? "ALQUILADO" : "LIBRE";
    }

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
    public int getPlanta() { return planta; }
    public void setPlanta(int planta) { this.planta = planta; }
    public String getPuerta() { return puerta; }
    public void setPuerta(String puerta) { this.puerta = puerta; }
    public int getHabitaciones() { return habitaciones; }
    public void setHabitaciones(int habitaciones) { this.habitaciones = habitaciones; }
    public int getBanos() { return banos; }
    public void setBanos(int banos) { this.banos = banos; }
    public boolean isGestionadoPorEmpresa() { return gestionadoPorEmpresa; }
    public void setGestionadoPorEmpresa(boolean gestionadoPorEmpresa) { this.gestionadoPorEmpresa = gestionadoPorEmpresa; }
    public double getRentaMensual() { return rentaMensual; }
    public void setRentaMensual(double rentaMensual) { this.rentaMensual = rentaMensual; }
    public String getInquilinoId() { return inquilinoId; }
    public void setInquilinoId(String inquilinoId) { this.inquilinoId = inquilinoId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
