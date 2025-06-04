package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.MedicalRecordRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.MedicalRecordReponseDTO;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Create a new medical record")
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
    @Operation(summary = "Get all medical records")
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

    @GetMapping("/patient-record/{patient_id}")
    @PreAuthorize("hasRole('ADMIN') ")
    @Operation(summary = "Get a medical record by patient ID")
    public ResponseData<?> getMedicalRecordById(
            @RequestParam Long patient_id,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "patient_id:asc") String sortBy
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

    @GetMapping("/doctor-record/{doctor_id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseData<?> getMedicalRecordByDoctorId(
            @RequestParam Long doctor_id,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "doctor_id:asc") String sortBy
    ) {
        log.info("Fetching medical record with Doctor ID: {}", doctor_id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    medicalRecordService.getMedicalRecordsByDoctorId(doctor_id, pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching medical record: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching medical record: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update a medical record")
    public ResponseData<?> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequestDTO requestDTO
    ) {
        log.info("Updating medical record with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    medicalRecordService.updateMedicalRecord(id, requestDTO));
        } catch (Exception e) {
            log.error("Error updating medical record: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating medical record: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a medical record")
    public ResponseData<?> deleteMedicalRecord(@PathVariable Long id) {
        log.info("Deleting medical record with ID: {}", id);
        try {
            log.info("Deleting medical record with ID: {}", id);
            medicalRecordService.deleteMedicalRecord(id);
            return new ResponseData<>(HttpStatus.OK.value(), "Success", "Medical record deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting medical record: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting medical record: " + e.getMessage());
        }
    }

}
