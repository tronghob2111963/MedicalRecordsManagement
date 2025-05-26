package com.example.MedicalRecordsManagement.controller;


import com.example.MedicalRecordsManagement.dto.request.DoctorRequestDTO;
import com.example.MedicalRecordsManagement.dto.response.PageResponse;
import com.example.MedicalRecordsManagement.dto.response.ResponseData;
import com.example.MedicalRecordsManagement.dto.response.ResponseError;
import com.example.MedicalRecordsManagement.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/doctors")
@Tag(name = "Doctors", description = "Endpoints for managing doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/all-doctors")
    @Operation(summary = "Get all doctors")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
   public ResponseData<?> getAllDoctors(@RequestParam(defaultValue = "1") int pageNo,
                                        @RequestParam(defaultValue = "10") int pageSize,
                                        @RequestParam(defaultValue = "ID:asc") String sortBy) {
        log.info("Fetching all doctors with pageNo: {}, pageSize: {}, sortBy: {}", pageNo, pageSize, sortBy);
        try {
            log.info("Fetching all doctors with pageNo: {}, pageSize: {}, sortBy: {}", pageNo, pageSize, sortBy);
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    doctorService.getAllDoctors(pageNo, pageSize, sortBy));
        } catch (Exception e) {
            log.error("Error fetching doctors: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching doctors: " + e.getMessage());
        }
    }

    @GetMapping("/doctor/{id}")
    @Operation(summary = "Get doctor by ID")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseData<?> getDoctorById(@RequestParam Long id) {
        log.info("Fetching doctor with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    doctorService.getDoctorById(id));
        } catch (Exception e) {
            log.error("Error fetching doctor: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error fetching doctor: " + e.getMessage());
        }
    }

    @PostMapping("/create-doctor")
    @Operation(summary = "Create a new doctor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<?> createDoctor(@RequestBody DoctorRequestDTO doctorDTO) {
        log.info("Creating new doctor: {}", doctorDTO);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    doctorService.createDoctor(doctorDTO));
        } catch (Exception e) {
            log.error("Error creating doctor: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error creating doctor: " + e.getMessage());
        }
    }

    @PutMapping("/update-doctor")
    @Operation(summary = "Update an existing doctor")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<?> updateDoctor(@RequestParam Long id, @RequestBody DoctorRequestDTO doctorDTO) {
        log.info("Updating doctor with ID: {}", id);
        try {
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    doctorService.updateDoctor(id, doctorDTO));
        } catch (Exception e) {
            log.error("Error updating doctor: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error updating doctor: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-doctor/{id}")
    @Operation(summary = "Delete a doctor by ID")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseData<?> deleteDoctor(@PathVariable Long id) {
        log.info("Deleting doctor with ID: {}", id);
        try {
            doctorService.deleteDoctor(id);
            return new ResponseData<>(HttpStatus.OK.value(), "Success",
                    null);
        } catch (Exception e) {
            log.error("Error deleting doctor: {}", e.getMessage());
            return new ResponseError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error deleting doctor: " + e.getMessage());
        }
    }

}
