package com.example.MedicalRecordsManagement.repository;

import com.example.MedicalRecordsManagement.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END FROM Patient p WHERE p.id_number = :id_Number")
    boolean existsById_Number(@Param("id_Number") String id_Number);

    @Query("SELECT p FROM Patient p WHERE p.id_number = :idNumber")
    Patient findById_Number(String idNumber);
}
