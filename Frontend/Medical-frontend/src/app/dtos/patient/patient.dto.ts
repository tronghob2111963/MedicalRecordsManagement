import  {
    IsString,
    IsNotEmpty,
    IsPhoneNumber,
    IsDate,
} from 'class-validator';

export class patientDTO {

    @IsString()
    @IsNotEmpty()
    full_Name: string;

    @IsDate()
    date_of_birth: string;

    @IsString()
    gender: string;

    @IsPhoneNumber()
    phone_Number: string;

    @IsString()
    address: string;

    @IsString()
    @IsNotEmpty()
    id_Number: string;

    @IsString()
    email: string;

    @IsString()
    blood_type: string;

    @IsString()
    marital_status: string;

    @IsString()
    occupation: string;

    @IsString()
    allergies: string;
    constructor(data: any){
        this.full_Name = data.full_Name || '';
        this.date_of_birth = data.date_of_birth || '';
        this.gender = data.gender || '';
        this.phone_Number = data.phone_Number || '';
        this.address = data.address || '';
        this.id_Number = data.id_Number || '';
        this.email = data.email || '';
        this.blood_type = data.blood_type || '';
        this.marital_status = data.marital_status || '';
        this.occupation = data.occupation || '';
        this.allergies = data.allergies || '';
    }
}