package com.example.MedicalRecordsManagement.repository;

import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.entity.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {



    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient_id.id = :patientId")
     Page<MedicalRecord> findByPatientId(Long patientId, Pageable pageable);

    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor_id.id = :doctorId")
    Page<MedicalRecord> findByDoctor_id_Id(Long doctorId, Pageable pageable);




}
