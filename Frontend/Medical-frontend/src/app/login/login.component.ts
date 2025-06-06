import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, TokenResponse } from '../services/auth.service';
import { LoginDTO } from '../dtos/auth/login.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
        console.log('Login successful:', {
          accessToken: response.accessToken.substring(0, 20) + '...',
          role: response.role
        });

        if (this.authService.isLoggedIn()) {
          setTimeout(() => {
            this.redirectBasedOnRole(response.role);
            this.isLoading = false;
          }, 1000);
        } else {
          this.errorMessage = 'Đăng nhập thành công nhưng token không hợp lệ. Vui lòng thử lại.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Login error in component:', error.message);
        this.errorMessage = error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
        this.isLoading = false;
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    console.log('Redirecting based on role:', role);
    switch (role) {
      case 'ADMIN':
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

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { AuthService, TokenResponse } from '../services/auth.service';
// import { LoginDTO } from '../dtos/auth/login.dto';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   imports: [
//     ReactiveFormsModule,
//     CommonModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {
// [x: string]: any;
//   loginForm: FormGroup;
//   isLoading = false;
//   errorMessage = '';
//   successMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required]],
//       password: ['', [Validators.required]]
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.invalid) {
//       this.markFormGroupTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     const loginData: LoginDTO = {
//       username: this.loginForm.value.username.trim(),
//       password: this.loginForm.value.password
//     };

//     this.authService.login(loginData).subscribe({
//       next: (response: TokenResponse) => {
//         this.successMessage = 'Đăng nhập thành công!';
//         console.log('Login successful:', response.AccessToken, response.role);
//         // Lưu tokens
//         this.authService.saveTokens(response, loginData.username);
//         this.successMessage = `Token: ${response.AccessToken}, Role: ${response.role}`;
//         // Delay một chút để user thấy thông báo thành công
//         if (this.authService.isLoggedIn()) {
//           setTimeout(() => {
//             this.redirectBasedOnRole(response.role);
//           }, 1000); // Delay để hiển thị thông báo thành công
//         } else {
//           this.errorMessage = 'Đăng nhập thành công nhưng token không hợp lệ. Vui lòng thử lại.';
//           this.isLoading = false;
//         }
//       },
//       error: (error) => {
//         console.error('Login error:', error);

//         // Xử lý các loại lỗi khác nhau
//         if (error.status === 403) {
//           this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
//         }
//         else if (error.status === 0) {
//           this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
//         }

//         this.isLoading = false;
//       }
//     });
//   }



//   private redirectBasedOnRole(role: string): void {
//     // Điều hướng dựa trên role
//     switch (role) {
//       case 'ADMIN':
//         this.router.navigate(['/patient']);
//         break;
//       case 'DOCTOR':
//         this.router.navigate(['/patient']);
//         break;
//       default:
//         this.router.navigate(['/dashboard']);
//         break;
//     }
//   }

//   private markFormGroupTouched(): void {
//     Object.keys(this.loginForm.controls).forEach(key => {
//       const control = this.loginForm.get(key);
//       control?.markAsTouched();
//     });
//   }

//   // Getter methods để truy cập form controls trong template
//   get username() {
//     return this.loginForm.get('username');
//   }

//   get password() {
//     return this.loginForm.get('password');
//   }
// }