package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.dto.request.PatientRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.PatientDetailResponseDTO;
import com.example.MedicalRecordsManagement.dto.response.PatientListResponseDTO;
import com.example.MedicalRecordsManagement.entity.Patient;
import com.example.MedicalRecordsManagement.repository.PatientRepository;
import com.example.MedicalRecordsManagement.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;



    @Override
    public PageResponse<?> getAllPatients(int pageNo, int pageSize, String sortBy) {

        int p = pageNo > 0 ? pageNo - 1 : 0;
        List<Sort.Order> sorts = new ArrayList<>();
        // Sort by ID
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
        Page<Patient> patients = patientRepository.findAll(pageable);
        List<PatientListResponseDTO> patient = patients.stream().map(patient1 ->
                PatientListResponseDTO.builder()
                        .full_Name(patient1.getFull_Name())
                        .gender(patient1.getGender())
                        .Date_Of_Birth(patient1.getDate_Of_Birth().toString())
                        .address(patient1.getAddress())
                        .phone_Number(patient1.getPhone_Number())

                        .build()
        ).toList();
        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(patients.getTotalElements())
                .totalPages(patients.getTotalPages())
                .items(patient)
                .build();
    }

    @Override
    public PatientDetailResponseDTO getPatientById(Long id) {
        log.info("Fetching patient with ID: {}", id);
        if(id == null) {
            log.error("Patient ID is null");
            throw new RuntimeException("Patient ID is null");
        }
        Patient patient = patientRepository.findById(id).orElse(null);
        if(patient == null) {
            log.error("Patient not found with ID: {}", id);
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        return PatientDetailResponseDTO.builder()
                .full_Name(patient.getFull_Name())
                .gender(patient.getGender())
                .Date_Of_Birth(patient.getDate_Of_Birth().toString())
                .address(patient.getAddress())
                .phone_Number(patient.getPhone_Number())
                .email(patient.getEmail())
                .id_number(patient.getId_number())
                .blood_type(patient.getBlood_type())
                .marital_status(patient.getMarital_status())
                .occupation(patient.getOccupation())
                .allergies(patient.getAllergies())
                .build();
    }

    @Override
    public PatientDetailResponseDTO createPatient(PatientRequestDTO patientDTO) {
        log.info("Creating new patient: {}", patientDTO);
        if (patientDTO == null) {
            log.error("Patient data is null");
            throw new RuntimeException("Patient data is null");
        }
        if(patientRepository.existsById_Number(patientDTO.getId_Number())) {
            log.info("Patient with ID: {} already exists", patientDTO.getId_Number());
            throw new RuntimeException("Patient with ID: " + patientDTO.getId_Number() + " already exists");

        }

        // Create a new patient
        Patient patient = Patient.builder()
                .full_Name(patientDTO.getFull_Name())
//                .Date_Of_Birth(LocalDate.parse(patientDTO.getDate_of_birth()))
                .Date_Of_Birth(LocalDate.parse(patientDTO.getDate_of_birth()))
                .gender(patientDTO.getGender())
                .phone_Number(patientDTO.getPhone_Number())
                .address(patientDTO.getAddress())
                .email(patientDTO.getEmail())
                .id_number(patientDTO.getId_Number())
                .blood_type(patientDTO.getBlood_type())
                .marital_status(patientDTO.getMarital_status())
                .occupation(patientDTO.getOccupation())
                .allergies(patientDTO.getAllergies())
                .build();
        patientRepository.save(patient);
        // Return the created patient
        return PatientDetailResponseDTO.builder()
                .full_Name(patient.getFull_Name())
                .gender(patient.getGender())
                .Date_Of_Birth(patient.getDate_Of_Birth().toString())
                .address(patient.getAddress())
                .phone_Number(patient.getPhone_Number())
                .email(patient.getEmail())
                .id_number(patient.getId_number())
                .blood_type(patient.getBlood_type())
                .marital_status(patient.getMarital_status())
                .occupation(patient.getOccupation())
                .allergies(patient.getAllergies())
                .build();
    }

    @Override
    public PatientDetailResponseDTO updatePatient(String id_number, PatientRequestDTO patientDTO) {
        log.info("Updating patient with ID_number: {}", id_number);
        if(id_number == null) {
            log.error("Patient ID_number is null");
            throw new RuntimeException("Patient ID_number is null");
        }
        if(patientRepository.existsById_Number(id_number) == false) {
            log.error("Patient not found with ID_number: {}", id_number);
            throw new RuntimeException("Patient not found with ID_number: " + id_number);
        }
        Patient patient = patientRepository.findById_Number(id_number);
        patient.setFull_Name(patientDTO.getFull_Name());
        patient.setDate_Of_Birth(LocalDate.parse(patientDTO.getDate_of_birth()));
        patient.setGender(patientDTO.getGender());
        patient.setPhone_Number(patientDTO.getPhone_Number());
        patient.setAddress(patientDTO.getAddress());
        patient.setEmail(patientDTO.getEmail());
        patientRepository.save(patient);
        return PatientDetailResponseDTO.builder()
                .full_Name(patient.getFull_Name())
                .gender(patient.getGender())
                .Date_Of_Birth(patient.getDate_Of_Birth().toString())
                .address(patient.getAddress())
                .phone_Number(patient.getPhone_Number())
                .email(patient.getEmail())
                .blood_type(patient.getBlood_type())
                .marital_status(patient.getMarital_status())
                .occupation(patient.getOccupation())
                .allergies(patient.getAllergies())
                .build();
    }

    @Override
    public void deletePatient(Long id) {
        log.info("Deleting patient with ID: {}", id);
        if(id == null) {
            log.error("Patient ID is null");
            throw new RuntimeException("Patient ID is null");
        }
        if(patientRepository.existsById(id) == false) {
            log.error("Patient not found with ID: {}", id);
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    @Override
    public Long CoutnPatients() {
    log.info("Counting total number of patients");
        long count = patientRepository.count();
        return count;
    }
}

