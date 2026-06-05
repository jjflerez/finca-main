package com.fincas.gestion;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class GestionFincasApplication {
    public static void main(String[] args) {
        SpringApplication.run(GestionFincasApplication.class, args);
    }

    @Bean
    public CommandLineRunner executeAlter(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE inmueble MODIFY COLUMN codigo_postal VARCHAR(20)");
                System.out.println("--- DB SCHEMA UPDATE: altered column codigo_postal successfully! ---");
            } catch (Exception e) {
                System.err.println("--- DB SCHEMA UPDATE FAILED: " + e.getMessage() + " ---");
            }
        };
    }
}
