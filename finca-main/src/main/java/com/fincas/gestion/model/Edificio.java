package com.fincas.gestion.model;

import jakarta.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("EDIFICIO")
public class Edificio extends Inmueble {

    private String nombreEdificio;
    private int totalPlantas;
    @Transient
    private List<Piso> pisos;
    
    @Transient
    private List<Local> locales;

    public Edificio() {
        this.pisos = new ArrayList<>();
        this.locales = new ArrayList<>();
    }

    public Edificio(String id, String direccion, String numero, String codigoPostal,
                    String ciudad, String provincia, String referenciaCatastral,
                    double superficieM2, String nombreEdificio, int totalPlantas) {
        super(id, direccion, numero, codigoPostal, ciudad, provincia, referenciaCatastral, superficieM2);
        this.nombreEdificio = nombreEdificio;
        this.totalPlantas = totalPlantas;
        this.pisos = new ArrayList<>();
        this.locales = new ArrayList<>();
    }

    @Override
    public String getTipoInmueble() {
        return "EDIFICIO";
    }

    public void agregarPiso(Piso piso) {
        pisos.add(piso);
    }

    public void agregarLocal(Local local) {
        locales.add(local);
    }

    public boolean eliminarPiso(String pisoid) {
        return pisos.removeIf(p -> p.getId().equals(pisoid));
    }

    public boolean eliminarLocal(String localId) {
        return locales.removeIf(l -> l.getId().equals(localId));
    }

    public int getPisosGestionados() {
        return (int) pisos.stream().filter(Piso::isGestionadoPorEmpresa).count();
    }

    public int getLocalesGestionados() {
        return (int) locales.stream().filter(Local::isGestionadoPorEmpresa).count();
    }

    public int getPisosNoGestionados() {
        return pisos.size() - getPisosGestionados();
    }

    public int getLocalesNoGestionados() {
        return locales.size() - getLocalesGestionados();
    }

    public String getResumen() {
        return nombreEdificio + " | Plantas: " + totalPlantas
                + " | Pisos gestionados: " + getPisosGestionados() + "/" + pisos.size()
                + " | Locales gestionados: " + getLocalesGestionados() + "/" + locales.size();
    }

    public String getNombreEdificio() {
        return nombreEdificio;
    }

    public void setNombreEdificio(String nombreEdificio) {
        this.nombreEdificio = nombreEdificio;
    }

    public int getTotalPlantas() {
        return totalPlantas;
    }

    public void setTotalPlantas(int totalPlantas) {
        this.totalPlantas = totalPlantas;
    }

    public List<Piso> getPisos() {
        return pisos;
    }

    public void setPisos(List<Piso> pisos) {
        this.pisos = pisos;
    }

    public List<Local> getLocales() {
        return locales;
    }

    public void setLocales(List<Local> locales) {
        this.locales = locales;
    }
}
