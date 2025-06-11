import  {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate,
} from 'class-validator';

export class medicalRecordDTO{

    @IsNotEmpty()
    patient_id: number;

    @IsNotEmpty()
    doctor_id: number;

    diagnosis: string;
    treatment: string;

    @IsDate()
    visit_date: string;
    Note: string;
    status: string

    constructor(data: any){
        this.patient_id = data.patient_id || 0;
        this.doctor_id = data.doctor_id || 0;
        this.diagnosis = data.diagnosis || '';
        this.treatment = data.treatment || '';
        this.visit_date = data.visit_date || '';
        this.Note = data.Note || '';
        this.status = data.status || '';
    }
}

// private Long patient_id;
// private Long doctor_id;
// private String diagnosis;
// private String treatment;
// private String visit_date;
// private String Note;
// private String status = "Under_treatment";