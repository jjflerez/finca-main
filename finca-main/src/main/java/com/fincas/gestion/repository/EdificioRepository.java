package com.fincas.gestion.repository;

import com.fincas.gestion.model.Edificio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EdificioRepository extends JpaRepository<Edificio, String> {
    List<Edificio> findByActivoTrue();
    List<Edificio> findByActivoTrueAndInquilinoIdIsNull();
}
