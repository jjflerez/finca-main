package com.fincas.gestion.repository;

import com.fincas.gestion.model.MovimientoBancario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovimientoBancarioRepository extends JpaRepository<MovimientoBancario, Long> {
    List<MovimientoBancario> findByCuentaBancariaId(Long cuentaId);
    List<MovimientoBancario> findByInmuebleId(String inmuebleId);
    List<MovimientoBancario> findByFechaBetween(LocalDate desde, LocalDate hasta);
    List<MovimientoBancario> findByTipo(MovimientoBancario.TipoMovimiento tipo);
}
