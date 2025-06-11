package com.example.MedicalRecordsManagement.controller;

import com.example.MedicalRecordsManagement.dto.request.PatientRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.dto.response.ResponseError;
import com.example.MedicalRecordsManagement.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/patient")
@Tag(name = "Patient", description = "Patient API")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/all-patients")
    @Operation(summary = "Get all patients")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseData<?> getAllPatients(@RequestParam(defaultValue = "1") int pageNo,
                                          @RequestParam(defaultValue = "10") int pageSize,
                                          @RequestParam(defaultValue = "ID:asc") String sortBy) {
        log.info("Fetching all patients with pageNo: {}, pageSize: {}, sortBy: {}", pageNo, pageSize, sortBy);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.getAllPatients(pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching patients: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching patients: " + e.getMessage());
        }
    }

    @GetMapping("/patient-detail/{id}")
    @Operation(summary = "Get patient by ID")
     @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseData<?> getPatientById(@PathVariable Long id) {
        log.info("Fetching patient with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.getPatientById(id));
        } catch (Exception e) {
            log.error("Error fetching patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching patient: " + e.getMessage());
        }
    }

    @PostMapping("/create-patient")
    @Operation(summary = "Create a new patient")
   @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseData<?> createPatient(@RequestBody PatientRequestDTO patientDTO) {
        log.info("Creating new patient: {}", patientDTO);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.createPatient(patientDTO));
        } catch (Exception e) {
            log.error("Error creating patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error creating patient: " + e.getMessage());
        }
    }
    @PutMapping("/update-patient/{id}")
    @Operation(summary = "Update a patient")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseData<?> updatePatient(@PathVariable Long id,
                                         @RequestBody PatientRequestDTO patientDTO) {
        log.info("Updating patient with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    patientService.updatePatient(id, patientDTO));
        } catch (Exception e) {
            log.error("Error updating patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating patient: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-patient/{id}")
    @Operation(summary = "Delete a patient")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseData<?> deletePatient(@PathVariable Long id) {
        log.info("Deleting patient with ID: {}", id);
        try {
            patientService.deletePatient(id);
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    null);
        } catch (Exception e) {
            log.error("Error deleting patient: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting patient: " + e.getMessage());
        }
    }
}
