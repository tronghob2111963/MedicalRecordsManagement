package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.PatientRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.PatientDetailResponseDTO;

public interface PatientService {
    PageResponse<?> getAllPatients(int pageNo, int pageSize, String sortBy);
    PatientDetailResponseDTO getPatientById(Long id);
    PatientDetailResponseDTO createPatient(PatientRequestDTO patientDTO);
    PatientDetailResponseDTO updatePatient(Long id, PatientRequestDTO patientDTO);
    void deletePatient(Long id);
    Long CoutnPatients();

}
