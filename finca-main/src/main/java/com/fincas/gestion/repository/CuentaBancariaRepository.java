package com.fincas.gestion.repository;

import com.fincas.gestion.model.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {
    List<CuentaBancaria> findByBancoId(Long bancoId);
    List<CuentaBancaria> findByInmuebleId(String inmuebleId);
}
