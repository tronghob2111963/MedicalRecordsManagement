package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.MedicalRecordRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.MedicalRecordReponseDTO;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medical-records")
@Tag(name = "Medical Records")
@Slf4j(topic = "MEDICAL_RECORDS_CONTROLLER")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseData<?> createMedicalRecord(
            @RequestBody MedicalRecordRequestDTO requestDTO
    ) {
        log.info("Creating medical record");
        try{
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    medicalRecordService.createMedicalRecord(requestDTO));

        } catch (Exception e) {
            log.error("Error creating medical record: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error creating medical record: " + e.getMessage());
        }
    }

    @GetMapping("/all-medical-records")
    @PreAuthorize("hasRole('ADMIN') ")
    public ResponseData<?> getAllMedicalRecords(@RequestParam(defaultValue = "1") int pageNo,
                                                @RequestParam(defaultValue = "10") int pageSize,
                                                @RequestParam(defaultValue = "Id:asc") String sortBy) {
        log.info("Fetching all medical records");
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    medicalRecordService.getAllMedicalRecords(pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching medical records: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching medical records: " + e.getMessage());
        }
    }

    @GetMapping("/medical-record/{id}")
    @PreAuthorize("hasRole('ADMIN') ")
    public ResponseData<?> getMedicalRecordById(
            @RequestParam Long patient_id,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "Id:asc") String sortBy
    ) {
        log.info("Fetching medical record with ID: {}", patient_id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    medicalRecordService.getMedicalRecordsByPatientId(patient_id, pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching medical record: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching medical record: " + e.getMessage());
        }
    }

}
