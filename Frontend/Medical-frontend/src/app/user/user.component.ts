import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserResponseDTO, UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  users: UserResponseDTO[] = [];

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  // Sorting properties
  sortBy: string = 'id:asc';

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.sortBy).subscribe({
      next: (response) => {
        if(response.status === 200 && response.data) {
          this.users = response.data.items;
          this.currentPage = response.data.pageNo;
          this.pageSize = response.data.pageSize;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
        } else {
          this.errorMessage = response.message || 'An error occurred while loading users.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = error.message || 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  viewUser(Id: number): void {
    this.router.navigate(['/user', Id]);
  }
  createUser(): void {
    this.router.navigate(['/create-user']);
  }

  editUser(Id: number): void {
    this.router.navigate(['/edit-user', Id]);
  }

  deleteUser(Id: number): void {
    this.userService.deleteUser(Id).subscribe({
      next: (response) => {
        if(response.status === 200) {
          this.loadUser();
        } else {
          this.errorMessage = response.message || 'An error occurred while deleting user.';
        }
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.errorMessage = error.message || 'Failed to delete user. Please try again.';
      }
    });
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUser();
    }
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadUser();
  }

  /**
   * Handle sort change
   */
  onSortChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadUser();
  }

  /**
   * Refresh the user list
   */
  refresh(): void {
    this.loadUser();
  }

  /**
   * Get array of page numbers for pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}