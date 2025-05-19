package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.PatientRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.PatientResponseDTO;

public interface PatientService {
    PageResponse<?> getAllPatients(int pageNo, int pageSize, String sortBy);
    PatientResponseDTO getPatientById(Long id);
    PatientResponseDTO createPatient(PatientRequestDTO patientDTO);
    PatientResponseDTO updatePatient(String id_number, PatientRequestDTO patientDTO);
    void deletePatient(Long id);


}
