package com.fincas.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class MovimientoBancario {

    public enum TipoMovimiento { GASTO, INGRESO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipo;

    private LocalDate fecha;
    private double importe;

    // Tipo de gasto o ingreso (ej: "Reparacion ascensor", "Cobro recibo", etc.)
    @Column(length = 100)
    private String concepto;

    @Column(length = 255)
    private String descripcion;

    // Inmueble (edificio/piso/local) al que está asociado
    @Column(length = 50)
    private String inmuebleId;

    @ManyToOne
    @JoinColumn(name = "cuenta_bancaria_id")
    private CuentaBancaria cuentaBancaria;

    // Referencia al recibo, si el ingreso corresponde a uno
    private Long reciboId;

    public MovimientoBancario() {
        this.fecha = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoMovimiento getTipo() { return tipo; }
    public void setTipo(TipoMovimiento tipo) { this.tipo = tipo; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public double getImporte() { return importe; }
    public void setImporte(double importe) { this.importe = importe; }

    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getInmuebleId() { return inmuebleId; }
    public void setInmuebleId(String inmuebleId) { this.inmuebleId = inmuebleId; }

    public CuentaBancaria getCuentaBancaria() { return cuentaBancaria; }
    public void setCuentaBancaria(CuentaBancaria cuentaBancaria) { this.cuentaBancaria = cuentaBancaria; }

    public Long getReciboId() { return reciboId; }
    public void setReciboId(Long reciboId) { this.reciboId = reciboId; }
}
