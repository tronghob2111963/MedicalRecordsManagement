package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.dto.request.MedicalRecordRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.MedicalRecordReponseDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.entity.Doctor;
import com.example.MedicalRecordsManagement.entity.MedicalRecord;
import com.example.MedicalRecordsManagement.entity.Patient;
import com.example.MedicalRecordsManagement.repository.DoctorRepository;
import com.example.MedicalRecordsManagement.repository.MedicalRecordRepository;
import com.example.MedicalRecordsManagement.repository.PatientRepository;
import com.example.MedicalRecordsManagement.service.MedicalRecordService;
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
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@Slf4j(topic = "MEDICAL_RECORD_SERVICE")
@RequiredArgsConstructor
public class MedicalRecordImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public MedicalRecordReponseDTO createMedicalRecord(MedicalRecordRequestDTO request) {
        log.info("Creating medical record for patient ID: {}", request.getPatient_id(),request.getDotor_id(), request.getNote());
        Long patientId = request.getPatient_id();
        Long doctorId = request.getDotor_id();
        String note = request.getNote();

       if(patientId == null){
           log.error("Patient ID is null");
           return null;
       }
       if(doctorId == null){
           log.error("Doctor ID is null");
           return null;
       }
       //tim ID cua patient va doctor
       Patient patient = patientRepository.findById(patientId)
               .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + patientId));

       Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));

       //Tao moi medical record
        MedicalRecord medicalRecord = MedicalRecord.builder()
                        .patient_id(patient)
                        .doctor_id(doctor)
                        .note(note)
                        .build();
        medicalRecordRepository.save(medicalRecord);
        MedicalRecordReponseDTO response = MedicalRecordReponseDTO.builder()
                .id(medicalRecord.getId())
                .patient_id(medicalRecord.getPatient_id().getID())
                .dotor_id(medicalRecord.getDoctor_id().getId())
                .Note(medicalRecord.getNote())
                .build();
        return response;

    }

    @Override
    public PageResponse<?> getAllMedicalRecords(int pageNo, int pageSize, String sortBy) {
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
        Page<MedicalRecord> medicalRecords = medicalRecordRepository.findAll(pageable);
        List<MedicalRecordReponseDTO> medicalRecordReponseDTOS = medicalRecords.stream().map(
                medicalRecord -> MedicalRecordReponseDTO.builder()
                        .id(medicalRecord.getId())
                        .patient_id(medicalRecord.getPatient_id().getID())
                        .dotor_id(medicalRecord.getDoctor_id().getId())
                        .Note(medicalRecord.getNote())
                        .build()
        ).toList();
        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(medicalRecords.getTotalElements())
                .totalPages(medicalRecords.getTotalPages())
                .items(medicalRecordReponseDTOS)
                .build();
    }

    @Override
    public PageResponse<?> getMedicalRecordsByPatientId(Long patientId, int pageNo, int pageSize, String sortBy) {
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
        Page<MedicalRecord> medicalRecords = medicalRecordRepository.findByPatientId(patientId, pageable);
        List<MedicalRecordReponseDTO> medicalRecordReponseDTOS = medicalRecords.stream().map(
                medicalRecord -> MedicalRecordReponseDTO.builder()
                        .id(medicalRecord.getId())
                        .patient_id(medicalRecord.getPatient_id().getID())
                        .dotor_id(medicalRecord.getDoctor_id().getId())
                        .Note(medicalRecord.getNote())
                        .build()
        ).toList();
        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(medicalRecords.getTotalElements())
                .totalPages(medicalRecords.getTotalPages())
                .items(medicalRecordReponseDTOS)
                .build();


    }

    @Override
    public PageResponse<?> getMedicalRecordsByDoctorId(Long doctorId, int page, int size, String sortBy) {
        return null;
    }

    @Override
    public MedicalRecordReponseDTO updateMedicalRecord(Long id, MedicalRecordRequestDTO medicalRecordRequestDTO) {
        return null;
    }
}
