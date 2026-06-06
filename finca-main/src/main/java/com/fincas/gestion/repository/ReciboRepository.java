package com.fincas.gestion.repository;

import com.fincas.gestion.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReciboRepository extends JpaRepository<Recibo, Long> {
    List<Recibo> findByInmuebleId(String inmuebleId);
    List<Recibo> findByInmuebleIdOrderByFechaEmisionDesc(String inmuebleId);
    List<Recibo> findByCobradoFalse();
    List<Recibo> findByCobradoTrue();
    List<Recibo> findByCobradoFalseAndFechaEmisionBetween(LocalDate desde, LocalDate hasta);
    List<Recibo> findByCobradoTrueAndFechaEmisionBetween(LocalDate desde, LocalDate hasta);
    List<Recibo> findByFechaEmisionBetween(LocalDate desde, LocalDate hasta);
    Optional<Recibo> findTopByInmuebleIdOrderByNumeroReciboDesc(String inmuebleId);
    Optional<Recibo> findTopByInmuebleIdAndFechaEmisionBeforeOrderByFechaEmisionDesc(String inmuebleId, LocalDate fecha);
    List<Recibo> findByInquilinoDni(String inquilinoDni);
    List<Recibo> findByInquilinoDniAndCobradoAndFechaEmisionBetween(String inquilinoDni, boolean cobrado, LocalDate desde, LocalDate hasta);
    List<Recibo> findByCobradoAndFechaEmisionBetween(boolean cobrado, LocalDate desde, LocalDate hasta);
}
