import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, TokenResponse } from '../services/auth.service';
import { LoginDTO } from '../dtos/auth/login.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
[x: string]: any;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loginData: LoginDTO = {
      username: this.loginForm.value.username.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (response: TokenResponse) => {
        this.successMessage = 'Đăng nhập thành công!';

        // Lưu tokens
        this.authService.saveTokens(response);
        // Delay một chút để user thấy thông báo thành công
        setTimeout(() => {
          this.redirectBasedOnRole(response.role);
        }, 1000);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);

        // Xử lý các loại lỗi khác nhau
        if (error.status === 403) {
          this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
        }
        else if (error.status === 0) {
          this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
        }

        this.isLoading = false;
      }
    });
  }

  // onSubmit(): void {
  //   if (this.loginForm.valid) {
  //     this.isLoading = true;
  //     this.errorMessage = '';

  //     const loginData: LoginDTO = {
  //       username: this.loginForm.value.username,
  //       password: this.loginForm.value.password
  //     };

  //     this.authService.login(loginData).subscribe({
  //       next: (response: TokenResponse) => {
  //         // Lưu tokens vào localStorage
  //         this.authService.saveTokens(response);
  //         // Điều hướng dựa trên role của user
  //         this.redirectBasedOnRole(response.role);
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Login error:', error);
  //         this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.markFormGroupTouched();
  //   }
  // }

  private redirectBasedOnRole(role: string): void {
    // Điều hướng dựa trên role
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/patient']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/patient']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods để truy cập form controls trong template
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}