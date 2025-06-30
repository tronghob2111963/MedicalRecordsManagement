import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserCreationRequest, UserResponseDTO } from '../../services/user.service';  // điều chỉnh lại đường dẫn nếu cần
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  updateUserForm!: FormGroup;
  userId!: number;
  isLoading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadUserData();
  }

  initForm(): void {
    this.updateUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]], // không bắt buộc nếu chỉ muốn đổi username hoặc role
      role: ['', Validators.required],
      doctor_id: ['']
    });
  }

  loadUserData(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.updateUserForm.patchValue({
          username: user.username,
          role: user.role,
          doctor_id: user.doctor_id || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.message = 'Không thể tải thông tin người dùng.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.updateUserForm.invalid) {
      this.message = 'Vui lòng nhập đầy đủ thông tin hợp lệ.';
      return;
    }

    const formValue = this.updateUserForm.value;

    const request: UserCreationRequest = {
      username: formValue.username,
      password: formValue.password || undefined, // nếu không nhập sẽ không cập nhật
      doctorId: formValue.doctor_id || undefined,
      role: formValue.role
    };

    this.isLoading = true;

    this.userService.updateUser(this.userId, request).subscribe({
      next: (res) => {
        this.message = 'Cập nhật người dùng thành công!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/users']), 1500); // chuyển hướng sau khi cập nhật
      },
      error: (err) => {
        this.message = 'Cập nhật thất bại. Vui lòng thử lại.';
        this.isLoading = false;
      }
    });
  }
}
