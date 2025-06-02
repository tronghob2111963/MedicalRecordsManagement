-- Disable foreign key checks to avoid constraint violations during updates
SET FOREIGN_KEY_CHECKS=0;

-- 1. First, drop the foreign key constraints
ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS appointments_ibfk_2;
ALTER TABLE medicalrecordinfo DROP FOREIGN KEY IF EXISTS medicalrecordinfo_ibfk_1;
ALTER TABLE prescriptions DROP FOREIGN KEY IF EXISTS prescriptions_ibfk_1;

-- 2. Modify the columns to ensure they have matching types
-- Make sure doctors.id is BIGINT
ALTER TABLE doctors MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Update appointments.doctor_id to match doctors.id
ALTER TABLE appointments MODIFY COLUMN doctor_id BIGINT;

-- Update medicalrecords.id to BIGINT
ALTER TABLE medicalrecords MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Update medicalrecordinfo.record_id to match medicalrecords.id
ALTER TABLE medicalrecordinfo MODIFY COLUMN record_id BIGINT;

-- Update prescriptions.record_ID to match medicalrecords.id
ALTER TABLE prescriptions MODIFY COLUMN record_ID BIGINT;

-- 3. Recreate the foreign key constraints
ALTER TABLE appointments 
    ADD CONSTRAINT fk_appointment_doctor 
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) 
    ON DELETE SET NULL;

ALTER TABLE medicalrecordinfo 
    ADD CONSTRAINT fk_medicalrecordinfo_record 
    FOREIGN KEY (record_id) REFERENCES medicalrecords(id) 
    ON DELETE CASCADE;

ALTER TABLE prescriptions 
    ADD CONSTRAINT fk_prescription_record 
    FOREIGN KEY (record_ID) REFERENCES medicalrecords(id) 
    ON DELETE CASCADE;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
