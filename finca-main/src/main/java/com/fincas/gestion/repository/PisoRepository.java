package com.fincas.gestion.repository;

import com.fincas.gestion.model.Piso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PisoRepository extends JpaRepository<Piso, String> {
    List<Piso> findByActivoTrue();
    List<Piso> findByActivoTrueAndInquilinoIdIsNull();
    List<Piso> findByEdificioIdAndActivoTrue(String edificioId);
    List<Piso> findByActivoTrueAndInquilinoIdIsNotNull();
}
