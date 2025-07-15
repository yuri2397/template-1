import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  focusedFields: Set<string> = new Set();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Clear error message when form changes
    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response: any) => {
            this.showMessage('Connexion réussie ! Redirection en cours...', 'success');

            // Redirect after a brief delay
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          },
          error: (error: any) => {
            console.error('Erreur de connexion:', error);

            // Handle different error types
            if (error.status === 401) {
              this.errorMessage = 'Email ou mot de passe incorrect';
            } else if (error.status === 422) {
              this.errorMessage = 'Les données saisies ne sont pas valides';
            } else if (error.status === 429) {
              this.errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard';
            } else if (error.status === 0) {
              this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet';
            } else {
              this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer';
            }

            this.showMessage(this.errorMessage, 'error');
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onFieldFocus(fieldName: string): void {
    this.focusedFields.add(fieldName);
  }

  onFieldBlur(fieldName: string): void {
    this.focusedFields.delete(fieldName);
  }

  isFieldFocused(fieldName: string): boolean {
    return this.focusedFields.has(fieldName);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();

    // For now, show a message. In a real app, you'd navigate to forgot password page
    this.showMessage('Fonctionnalité de récupération de mot de passe bientôt disponible', 'info');
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.createToast(message, type);
  }

  private createToast(message: string, type: string): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8',
      warning: '#ffc107'
    };

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type as keyof typeof colors] || colors.info};
      color: ${type === 'warning' ? '#212529' : 'white'};
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 0.9rem;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }
}