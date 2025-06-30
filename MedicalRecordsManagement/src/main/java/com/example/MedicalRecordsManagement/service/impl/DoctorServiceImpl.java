package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.dto.request.DoctorRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.DoctorResponseDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.entity.Doctor;
import com.example.MedicalRecordsManagement.repository.DoctorRepository;
import com.example.MedicalRecordsManagement.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;


    @Override
    public PageResponse<?> getAllDoctors(int pageNo, int pageSize, String sortBy) {
        int p = pageNo > 0 ? pageNo - 1 : 0;
        List<Sort.Order> sorts = new ArrayList<>();
        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(.*)");
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    sorts.add(new Sort.Order(Sort.Direction.ASC, matcher.group(1)));
                } else {
                    sorts.add(new Sort.Order(Sort.Direction.DESC, matcher.group(1)));
                }
            }
        }
        Pageable pageable = PageRequest.of(p, pageSize, Sort.by(sorts));
        Page<Doctor> doctors = doctorRepository.findAll(pageable);
        List<DoctorResponseDTO>  doctorResponse = doctors.stream().map(
                Doctor -> DoctorResponseDTO.builder()
                        .id(Doctor.getId())
                        .full_name(Doctor.getFullName())
                        .specialty(Doctor.getSpecialty())
                        .phone_number(Doctor.getPhone_number())
                        .email(Doctor.getEmail())
                        .license_Number(Doctor.getLicenseNumber())
                        .status(Doctor.getStatus())
                        .build()
        ).toList();

        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(doctors.getTotalElements())
                .totalPages(doctors.getTotalPages())
                .items(doctorResponse)
                .build();
    }

    @Override
    public DoctorResponseDTO getDoctorById(Long id) {
        log.info("Fetching doctor with ID: {}", id);
        if (id == null) {
            log.error("Doctor ID cannot be null");
            throw new RuntimeException("Doctor ID cannot be null");
        }
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        return DoctorResponseDTO.builder()
                .id(doctor.getId())
                .full_name(doctor.getFullName())
                .email(doctor.getEmail())
                .phone_number(doctor.getPhone_number())
                .specialty(doctor.getSpecialty())
                .license_Number(doctor.getLicenseNumber())
                .status(doctor.getStatus())
                .build();
    }

    @Override
    public Long createDoctor(DoctorRequestDTO doctorDTO) {
        log.info("Creating new doctor: {}", doctorDTO);
        if (doctorDTO == null) {
            log.error("Doctor DTO cannot be null");
            throw new RuntimeException("Doctor DTO cannot be null");
        }
        if(doctorRepository.existsByLicenseNumber(doctorDTO.getLicenseNumber())){
            log.error("Doctor with license number {} already exists", doctorDTO.getLicenseNumber());
            throw new RuntimeException("Doctor with license number " + doctorDTO.getLicenseNumber() + " already exists");

        }
        Doctor doctor = Doctor.builder()
                .fullName(doctorDTO.getFull_name())
                .specialty(doctorDTO.getSpecialty())
                .phone_number(doctorDTO.getPhone_number())
                .email(doctorDTO.getEmail())
                .licenseNumber(doctorDTO.getLicenseNumber())
                .status(doctorDTO.getStatus())
                .build();
        doctorRepository.save(doctor);
        return doctor.getId();
    }

    @Override
    public DoctorResponseDTO updateDoctor(Long id, DoctorRequestDTO doctorDTO) {
        if(doctorDTO == null) {
            log.error("Doctor DTO cannot be null");
            throw new RuntimeException("Doctor DTO cannot be null");
        }
        if (id == null) {
            log.error("Doctor ID cannot be null");
            throw new RuntimeException("Doctor ID cannot be null");
        }
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            log.error("Doctor not found with ID: {}", id);
            throw new RuntimeException("Doctor not found with ID: " + id);
        }

        //set thông tin cho doctor
        doctor.setFullName(doctorDTO.getFull_name());
        doctor.setSpecialty(doctorDTO.getSpecialty());
        doctor.setPhone_number(doctorDTO.getPhone_number());
        doctor.setEmail(doctorDTO.getEmail());
        doctor.setStatus(doctorDTO.getStatus());
        doctorRepository.save(doctor);

        return DoctorResponseDTO.builder()
                .full_name(doctor.getFullName())
                .email(doctor.getEmail())
                .phone_number(doctor.getPhone_number())
                .specialty(doctor.getSpecialty())
                .status(doctor.getStatus())
                .build();
    }

    @Override
    public void deleteDoctor(Long id) {
        log.info("Deleting doctor with ID: {}", id);
        if (id == null) {
            log.error("Doctor ID cannot be null");
            throw new RuntimeException("Doctor ID cannot be null");
        }
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            log.error("Doctor not found with ID: {}", id);
            throw new RuntimeException("Doctor not found with ID: " + id);
        }
        doctorRepository.delete(doctor);
    }
}
