package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.MedicalRecordRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.MedicalRecordReponseDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;

public interface MedicalRecordService {
    MedicalRecordReponseDTO createMedicalRecord(MedicalRecordRequestDTO medicalRecordRequestDTO);
    PageResponse<?> getAllMedicalRecords(int page, int size, String sortBy);
    PageResponse<?> getMedicalRecordsByPatientId(Long patientId, int page, int size, String sortBy);
    PageResponse<?> getMedicalRecordsByDoctorId(Long doctorId, int page, int size, String sortBy);
    MedicalRecordReponseDTO updateMedicalRecord(Long id, MedicalRecordRequestDTO medicalRecordRequestDTO);
    void deleteMedicalRecord(Long id);
}
