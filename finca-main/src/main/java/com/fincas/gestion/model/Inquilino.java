package com.fincas.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Inquilino {

    public enum Sexo { HOMBRE, MUJER, OTRO }

    @Id
    @Column(length = 20)
    private String dni;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100)
    private String apellidos;

    private int edad;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String email;

    @Column(length = 500)
    private String fotografia;

    // Requisitos para poder alquilar
    private boolean tieneNomina;
    private boolean tieneAvalBancario;
    private boolean tieneContratoTrabajo;

    @Column(length = 20)
    private String avalistaDni; // DNI de quien le avala

    private boolean activo = true;
    private LocalDate fechaAlta;

    public Inquilino() {
        this.fechaAlta = LocalDate.now();
    }

    public boolean puedeAlquilar() {
        return tieneNomina || tieneAvalBancario || tieneContratoTrabajo || (avalistaDni != null && !avalistaDni.isEmpty());
    }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public int getEdad() { return edad; }
    public void setEdad(int edad) { this.edad = edad; }

    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFotografia() { return fotografia; }
    public void setFotografia(String fotografia) { this.fotografia = fotografia; }

    public boolean isTieneNomina() { return tieneNomina; }
    public void setTieneNomina(boolean tieneNomina) { this.tieneNomina = tieneNomina; }

    public boolean isTieneAvalBancario() { return tieneAvalBancario; }
    public void setTieneAvalBancario(boolean tieneAvalBancario) { this.tieneAvalBancario = tieneAvalBancario; }

    public boolean isTieneContratoTrabajo() { return tieneContratoTrabajo; }
    public void setTieneContratoTrabajo(boolean tieneContratoTrabajo) { this.tieneContratoTrabajo = tieneContratoTrabajo; }

    public String getAvalistaDni() { return avalistaDni; }
    public void setAvalistaDni(String avalistaDni) { this.avalistaDni = avalistaDni; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public LocalDate getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDate fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getNombreCompleto() { return nombre + " " + apellidos; }
}
