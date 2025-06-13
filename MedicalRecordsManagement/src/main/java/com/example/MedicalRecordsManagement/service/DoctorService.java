package com.example.MedicalRecordsManagement.service;

import com.example.MedicalRecordsManagement.dto.request.DoctorRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.DoctorResponseDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import org.springframework.http.ResponseEntity;

public interface DoctorService {
    PageResponse<?> getAllDoctors(int pageNo, int pageSize, String sortBy);
    DoctorResponseDTO getDoctorById(Long id);
    DoctorResponseDTO createDoctor(DoctorRequestDTO doctorDTO);
    DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO doctorDTO);
    void deleteDoctor(Long id);

}
