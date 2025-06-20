package com.example.MedicalRecordsManagement.service.impl;

import com.example.MedicalRecordsManagement.common.MedicalRecordStatus;
import com.example.MedicalRecordsManagement.dto.request.MedicalRecordRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.MedicalRecordDetailResponseDTO;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@Slf4j(topic = "MEDICAL_RECORD_SERVICE")
@RequiredArgsConstructor
public class MedicalRecordImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;


    //tao moi medical record
    @Override
    public MedicalRecordDetailResponseDTO createMedicalRecord(MedicalRecordRequestDTO request) {
        log.info("Creating medical record for patient ID: {}", request.getPatient_id(),request.getDoctor_id(), request.getNote());
        Long patientId = request.getPatient_id();
        Long doctorId = request.getDoctor_id();
        String diagnosis = request.getDiagnosis();
        String treatment = request.getTreatment();
        String note = request.getNote();
        String status = request.getStatus();

       //tim ID cua patient va doctor
       Patient patient = patientRepository.findById(patientId)
               .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + patientId));

       Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));

       //Tao moi medical record
        MedicalRecord medicalRecord = MedicalRecord.builder()
                        .patient_id(patient)
                        .doctor_id(doctor)
                        .diagnosis(diagnosis)
                        .treatment(treatment)
                        .status(MedicalRecordStatus.valueOf(status))
                        .visit_date(LocalDate.parse(request.getVisit_date()))
                        .note(note)
                        .build();
        medicalRecordRepository.save(medicalRecord);
        MedicalRecordDetailResponseDTO response = MedicalRecordDetailResponseDTO.builder()
                .id(medicalRecord.getId())
                .patient_Name(medicalRecord.getPatient_id().getFull_Name())
                .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                .diagnosis(medicalRecord.getDiagnosis())
                .treatment(medicalRecord.getTreatment())
                .visit_date(medicalRecord.getVisit_date().toString())
                .Note(medicalRecord.getNote())
                .status(medicalRecord.getStatus().toString())
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
                        .patient_Name(medicalRecord.getPatient_id().getFull_Name())
                        .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                        .Note(medicalRecord.getNote())
                        .status(medicalRecord.getStatus().toString())
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


    //tim kiem medical record theo patient_id
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
                        .patient_Name(medicalRecord.getPatient_id().getFull_Name())
                        .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                        .Note(medicalRecord.getNote())
                        .status(medicalRecord.getStatus().toString())
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


    //tim kiem medical record theo doctor_id
    @Override
    public PageResponse<?> getMedicalRecordsByDoctorId(Long doctorId, int pageNo, int pageSize, String sortBy) {
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
        Page<MedicalRecord> medicalRecords = medicalRecordRepository.findByDoctor_id_Id(doctorId, pageable);
        List<MedicalRecordReponseDTO> medicalRecordReponseDTOS = medicalRecords.stream().map(
                medicalRecord -> MedicalRecordReponseDTO.builder()
                        .id(medicalRecord.getId())
                        .patient_Name(medicalRecord.getPatient_id().getFull_Name())
                        .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                        .Note(medicalRecord.getNote())
                        .status(medicalRecord.getStatus().toString())
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


    //cap nhat medical record
    @Override
    public MedicalRecordReponseDTO updateMedicalRecord(Long id, MedicalRecordRequestDTO medicalRecordRequestDTO) {
        log.info("Updating medical record with ID: {}", id);
        if( id == null) {
            log.error("Medical record ID cannot be null");
            throw new IllegalArgumentException("Medical record ID cannot be null");
        }
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id).orElse(null);
        if (medicalRecord == null) {
            log.error("Medical record not found with ID: {}", id);
            throw new IllegalArgumentException("Medical record not found with ID: " + id);
        }
        if(medicalRecordRequestDTO.getDoctor_id() == null) {
            log.error("Doctor ID cannot be null");
            throw new IllegalArgumentException("Doctor ID cannot be null");
        }

        Doctor doctor_id = doctorRepository.findById(medicalRecordRequestDTO.getDoctor_id())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + medicalRecordRequestDTO.getDoctor_id()));

        Patient patient_id = patientRepository.findById(medicalRecordRequestDTO.getPatient_id())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + medicalRecordRequestDTO.getPatient_id()));
        medicalRecord.setDoctor_id(doctor_id);
        medicalRecord.setStatus(MedicalRecordStatus.valueOf(medicalRecordRequestDTO.getStatus()));
        medicalRecord.setVisit_date(LocalDate.parse(medicalRecordRequestDTO.getVisit_date()));
        medicalRecord.setDiagnosis(medicalRecordRequestDTO.getDiagnosis());
        medicalRecord.setTreatment(medicalRecordRequestDTO.getTreatment());
        medicalRecord.setNote(medicalRecordRequestDTO.getNote());
        MedicalRecord updatedMedicalRecord = medicalRecordRepository.save(medicalRecord);
        MedicalRecordReponseDTO result = MedicalRecordReponseDTO.builder()
                .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                .Note(updatedMedicalRecord.getNote())
                .status(updatedMedicalRecord.getStatus().toString())
                .build();
        return result;
    }

    @Override
    public void deleteMedicalRecord(Long id) {
        log.info("Deleting medical record with ID: {}", id);
        if (id == null) {
            log.error("Medical record ID cannot be null");
            throw new IllegalArgumentException("Medical record ID cannot be null");
        }
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id).orElse(null);
        if (medicalRecord == null) {
            log.error("Medical record not found with ID: {}", id);
            throw new IllegalArgumentException("Medical record not found with ID: " + id);
        }
        medicalRecordRepository.delete(medicalRecord);
    }

    @Override
    public MedicalRecordDetailResponseDTO getMedicalRecordDetail(Long id) {
        log.info("Getting medical record detail with ID: {}", id);
        if (id == null) {
            log.error("Medical record ID cannot be null");
            throw new IllegalArgumentException("Medical record ID cannot be null");
        }
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id).orElse(null);
        if (medicalRecord == null) {
            log.error("Medical record not found with ID: {}", id);
            throw new IllegalArgumentException("Medical record not found with ID: " + id);
        }
        MedicalRecordDetailResponseDTO result = MedicalRecordDetailResponseDTO.builder()
                .id(medicalRecord.getId())
                .patient_id(medicalRecord.getPatient_id().getID())
                .doctor_id(medicalRecord.getDoctor_id().getId())
                .patient_Name(medicalRecord.getPatient_id().getFull_Name())
                .doctor_Name(medicalRecord.getDoctor_id().getFullName())
                .diagnosis(medicalRecord.getDiagnosis())
                .treatment(medicalRecord.getTreatment())
                .status(medicalRecord.getStatus().toString())
                .visit_date(String.valueOf(medicalRecord.getVisit_date()))
                .Note(medicalRecord.getNote())
                .build();
        return result;
    }


}
