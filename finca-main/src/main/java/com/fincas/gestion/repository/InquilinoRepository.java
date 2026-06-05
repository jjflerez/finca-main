package com.fincas.gestion.repository;

import com.fincas.gestion.model.Inquilino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InquilinoRepository extends JpaRepository<Inquilino, String> {
    List<Inquilino> findByActivoTrue();
    List<Inquilino> findByActivoTrueOrderByFechaAltaAsc();
    List<Inquilino> findByActivoTrueAndFechaAltaBetween(LocalDate desde, LocalDate hasta);
}
