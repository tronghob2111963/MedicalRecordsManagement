package com.example.MedicalRecordsManagement.repository;

import com.example.MedicalRecordsManagement.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {


    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN TRUE ELSE FALSE END FROM Doctor d WHERE d.license_Number = :license_Number")
    boolean existsBylicense_Number(String license_Number);
}
