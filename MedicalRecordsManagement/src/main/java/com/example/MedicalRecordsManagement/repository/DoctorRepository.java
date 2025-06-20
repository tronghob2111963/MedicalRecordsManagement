package com.example.MedicalRecordsManagement.repository;

import com.example.MedicalRecordsManagement.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN TRUE ELSE FALSE END FROM Doctor d WHERE d.licenseNumber = :licenseNumber")
    boolean existsByLicenseNumber(@Param("licenseNumber") String licenseNumber);

    @Query("SELECT d.email FROM Doctor d WHERE d.licenseNumber = :licenseNumber")
    String findEmailByLicenseNumber(@Param("licenseNumber") String licenseNumber);
}
