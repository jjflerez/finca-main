package com.fincas.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Recibo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Número único por inmueble (no varía en el tiempo)
    private Long numeroRecibo;

    @Column(length = 50)
    private String inmuebleId; // ID del piso o local al que pertenece

    @Column(length = 20)
    private String inquilinoDni;

    private LocalDate fechaEmision;
    private boolean cobrado = false;

    // Conceptos OBLIGATORIOS (para todos los recibos)
    private double renta;

    // Conceptos OPCIONALES (solo para algunos recibos, no aparecen si = 0)
    private double agua;
    private double luz;
    private double ipc;       // Actualización IPC anual
    private double porteria;
    private double iva;
    private double otrosConceptos;

    @Column(length = 255)
    private String descripcionOtros;

    public Recibo() {}

    public double getTotalRecibo() {
        return renta + agua + luz + ipc + porteria + iva + otrosConceptos;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNumeroRecibo() { return numeroRecibo; }
    public void setNumeroRecibo(Long numeroRecibo) { this.numeroRecibo = numeroRecibo; }

    public String getInmuebleId() { return inmuebleId; }
    public void setInmuebleId(String inmuebleId) { this.inmuebleId = inmuebleId; }

    public String getInquilinoDni() { return inquilinoDni; }
    public void setInquilinoDni(String inquilinoDni) { this.inquilinoDni = inquilinoDni; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public boolean isCobrado() { return cobrado; }
    public void setCobrado(boolean cobrado) { this.cobrado = cobrado; }

    public double getRenta() { return renta; }
    public void setRenta(double renta) { this.renta = renta; }

    public double getAgua() { return agua; }
    public void setAgua(double agua) { this.agua = agua; }

    public double getLuz() { return luz; }
    public void setLuz(double luz) { this.luz = luz; }

    public double getIpc() { return ipc; }
    public void setIpc(double ipc) { this.ipc = ipc; }

    public double getPorteria() { return porteria; }
    public void setPorteria(double porteria) { this.porteria = porteria; }

    public double getIva() { return iva; }
    public void setIva(double iva) { this.iva = iva; }

    public double getOtrosConceptos() { return otrosConceptos; }
    public void setOtrosConceptos(double otrosConceptos) { this.otrosConceptos = otrosConceptos; }

    public String getDescripcionOtros() { return descripcionOtros; }
    public void setDescripcionOtros(String descripcionOtros) { this.descripcionOtros = descripcionOtros; }
}
