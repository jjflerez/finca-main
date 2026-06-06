package com.fincas.gestion.config;

import com.fincas.gestion.model.*;
import com.fincas.gestion.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository,
                                      EdificioRepository edificioRepository,
                                      PisoRepository pisoRepository,
                                      LocalRepository localRepository,
                                      InquilinoRepository inquilinoRepository) {
        return args -> {
            // Crear usuarios por defecto
            if (usuarioRepository.count() == 0) {
                usuarioRepository.save(new Usuario("admin", "admin123", "ADMIN"));
                usuarioRepository.save(new Usuario("secretario", "fincas2026", "SECRETARIO"));
                System.out.println("Usuarios por defecto creados.");
            }

            // Crear datos de prueba si no hay edificios
            if (edificioRepository.count() == 0) {
                // 1. Inquilinos
                Inquilino i1 = new Inquilino();
                i1.setDni("11111111A"); i1.setNombre("Carlos"); i1.setApellidos("Gómez");
                i1.setTelefono("600123456"); i1.setEmail("carlos@email.com");
                i1.setTieneNomina(true); i1.setActivo(true); i1.setFechaAlta(LocalDate.now());
                inquilinoRepository.save(i1);

                Inquilino i2 = new Inquilino();
                i2.setDni("22222222B"); i2.setNombre("María"); i2.setApellidos("López");
                i2.setTelefono("600654321"); i2.setEmail("maria@email.com");
                i2.setTieneAvalBancario(true); i2.setActivo(true); i2.setFechaAlta(LocalDate.now());
                inquilinoRepository.save(i2);

                Inquilino i3 = new Inquilino();
                i3.setDni("33333333C"); i3.setNombre("Empresa S.L."); i3.setApellidos("");
                i3.setTelefono("910000000"); i3.setEmail("contacto@empresasl.com");
                i3.setTieneContratoTrabajo(true); i3.setActivo(true); i3.setFechaAlta(LocalDate.now());
                inquilinoRepository.save(i3);

                // 2. Edificios
                Edificio ed1 = new Edificio("EDF-01", "Calle Mayor", "10", "28001", "Madrid", "Madrid", "REF-EDF-01", 1200.0, "Edificio Central", 4);
                ed1.setActivo(true);
                edificioRepository.save(ed1);

                Edificio ed2 = new Edificio("EDF-02", "Gran Vía", "55", "28013", "Madrid", "Madrid", "REF-EDF-02", 2500.0, "Torre Norte", 10);
                ed2.setActivo(true);
                edificioRepository.save(ed2);

                // 3. Pisos
                Piso p1 = new Piso("PIS-01", "Calle Mayor", "10", "28001", "Madrid", "Madrid", "REF-PIS-01", 90.0, "EDF-01", 1, "A", 3, 2, true, 850.0);
                p1.setActivo(true);
                pisoRepository.save(p1);

                Piso p2 = new Piso("PIS-02", "Calle Mayor", "10", "28001", "Madrid", "Madrid", "REF-PIS-02", 110.0, "EDF-01", 2, "B", 4, 2, true, 1100.0);
                p2.setActivo(true);
                // Alquilar este piso a Carlos
                p2.setInquilinoId("11111111A"); p2.setFechaInicioContrato(LocalDate.now().minusMonths(3)); p2.setFechaFinContrato(LocalDate.now().plusYears(1));
                pisoRepository.save(p2);

                Piso p3 = new Piso("PIS-03", "Gran Vía", "55", "28013", "Madrid", "Madrid", "REF-PIS-03", 75.0, "EDF-02", 5, "C", 2, 1, false, 950.0);
                p3.setActivo(true);
                pisoRepository.save(p3);

                // 4. Locales
                Local l1 = new Local("LOC-01", "Calle Mayor", "10", "28001", "Madrid", "Madrid", "REF-LOC-01", 150.0, "EDF-01", 1, Local.UsoLocal.COMERCIAL, true, 1500.0, true);
                l1.setActivo(true);
                localRepository.save(l1);

                Local l2 = new Local("LOC-02", "Gran Vía", "55", "28013", "Madrid", "Madrid", "REF-LOC-02", 300.0, "EDF-02", 2, Local.UsoLocal.OFICINA, true, 3200.0, true);
                l2.setActivo(true);
                // Alquilar este local a Empresa S.L.
                l2.setInquilinoId("33333333C"); l2.setFechaInicioContrato(LocalDate.now().minusMonths(6)); l2.setFechaFinContrato(LocalDate.now().plusYears(4));
                localRepository.save(l2);

                System.out.println("Datos de prueba (Inquilinos, Edificios, Pisos y Locales) generados exitosamente.");
            }
        };
    }
}
