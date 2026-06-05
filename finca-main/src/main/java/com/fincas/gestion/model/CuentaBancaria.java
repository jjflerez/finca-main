package com.fincas.gestion.model;

import jakarta.persistence.*;

@Entity
public class CuentaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String numeroCuenta; // IBAN

    private double saldo;

    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Banco banco;

    // Inmueble (edificio, piso o local) asociado a esta cuenta
    @Column(length = 50)
    private String inmuebleId;

    public CuentaBancaria() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroCuenta() { return numeroCuenta; }
    public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }

    public double getSaldo() { return saldo; }
    public void setSaldo(double saldo) { this.saldo = saldo; }

    public Banco getBanco() { return banco; }
    public void setBanco(Banco banco) { this.banco = banco; }

    public String getInmuebleId() { return inmuebleId; }
    public void setInmuebleId(String inmuebleId) { this.inmuebleId = inmuebleId; }
}
