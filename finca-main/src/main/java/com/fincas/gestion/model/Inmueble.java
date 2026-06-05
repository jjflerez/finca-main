package com.fincas.gestion.model;

import jakarta.persistence.*;


@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Inmueble {

    @Id
    private String id;
    private String direccion;
    private String numero;
    private String codigoPostal;
    private String ciudad;
    private String provincia;
    private String referenciaCatastral;
    @Column(name = "superficie_m2")
    private double superficieM2;
    private boolean activo = true;

    public Inmueble() {
    }

    public Inmueble(String id, String direccion, String numero, String codigoPostal,
                    String ciudad, String provincia, String referenciaCatastral, double superficieM2) {
        this.id = id;
        this.direccion = direccion;
        this.numero = numero;
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
        this.provincia = provincia;
        this.referenciaCatastral = referenciaCatastral;
        this.superficieM2 = superficieM2;
    }

    public abstract String getTipoInmueble();

    public String getDireccionCompleta() {
        return direccion + ", " + numero + ", " + codigoPostal + " " + ciudad + " (" + provincia + ")";
    }

    @Override
    public String toString() {
        return "[" + getTipoInmueble() + "] " + getDireccionCompleta() + " | " + superficieM2 + " m²";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getReferenciaCatastral() {
        return referenciaCatastral;
    }

    public void setReferenciaCatastral(String referenciaCatastral) {
        this.referenciaCatastral = referenciaCatastral;
    }

    public double getSuperficieM2() {
        return superficieM2;
    }

    public void setSuperficieM2(double superficieM2) {
        this.superficieM2 = superficieM2;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }
}
