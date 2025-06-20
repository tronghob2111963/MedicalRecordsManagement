package com.example.MedicalRecordsManagement.repository;

import com.example.MedicalRecordsManagement.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalHistoryReoisitory extends JpaRepository<MedicalHistory, Long> {
}
