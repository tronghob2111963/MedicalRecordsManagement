import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserCreationRequest, CreateUserResponse } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  availableRoles = [
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'ADMIN', label: 'Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.createUserForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['ROLE_USER', [Validators.required]],
      doctorId: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // Cập nhật validator của doctorId nếu role là DOCTOR
    this.createUserForm.get('role')?.valueChanges.subscribe(role => {
      const doctorIdControl = this.createUserForm.get('doctorId');
      if (role === 'DOCTOR') {
        doctorIdControl?.setValidators([Validators.required]);
      } else {
        doctorIdControl?.clearValidators();
        doctorIdControl?.setValue('');
      }
      doctorIdControl?.updateValueAndValidity();
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  get f() {
    return this.createUserForm.controls;
  }

  getFieldError(fieldName: string): string {
    const field = this.createUserForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} là bắt buộc`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} phải có ít nhất ${field.errors['minlength'].requiredLength} ký tự`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} không được vượt quá ${field.errors['maxlength'].requiredLength} ký tự`;
      }
      if (field.errors['pattern']) {
        return 'Tên đăng nhập chỉ được chứa chữ cái, số, gạch dưới và gạch ngang';
      }
      if (field.errors['passwordMismatch']) {
        return 'Mật khẩu xác nhận không khớp';
      }
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      role: 'Vai trò',
      doctorId: 'Mã bác sĩ'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.createUserForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  resetForm(): void {
    this.createUserForm.reset({
      username: '',
      password: '',
      confirmPassword: '',
      role: 'ROLE_USER',
      doctorId: ''
    });
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      this.createUser();
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.createUserForm.controls).forEach(key => {
      this.createUserForm.get(key)?.markAsTouched();
    });
  }

  private createUser(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.createUserForm.value;
    const request: UserCreationRequest = {
      username: formValue.username.trim(),
      password: formValue.password,
      role: formValue.role,
      doctor_id: formValue.role === 'DOCTOR' ? formValue.doctorId?.trim() : undefined
    };

    this.userService.createUser(request).subscribe({
      next: (response: CreateUserResponse) => {
        this.isLoading = false;
        if (response.status === 200 || response.status === 201) {
          this.successMessage = response.message || 'Tạo người dùng thành công!';
          this.resetForm();
          setTimeout(() => this.router.navigate(['/admin']), 2000);
        } else {
          this.errorMessage = response.message || 'Có lỗi xảy ra khi tạo người dùng';
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Bạn không có quyền thực hiện thao tác này';
        } else if (error.status === 409) {
          this.errorMessage = 'Tên đăng nhập đã tồn tại';
        } else if (error.status === 400) {
          this.errorMessage = 'Dữ liệu không hợp lệ';
        } else {
          this.errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  isAuthenticated(): boolean {
    return this.userService.isTokenValid();
  }
}
