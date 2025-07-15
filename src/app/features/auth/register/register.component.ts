import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showPasswordConfirmation = false;
  errorMessage = '';
  showSuccessModal = false;
  registeredEmail = '';
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
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      password_confirmation: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
      subscribeNewsletter: [false]
    }, {
      validators: this.passwordMatchValidator
    });

    // Clear error message when form changes
    this.registerForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  /**
   * Custom validator for password strength
   */
  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric;

    if (!valid) {
      return { pattern: true };
    }

    return null;
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.registerForm.value;
      const { name, email, password, password_confirmation } = formData;

      this.authService.register(name, email, password, password_confirmation)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (response: any) => {
            this.registeredEmail = email;
            this.showSuccessModal = true;
            this.showMessage('Compte créé avec succès ! Vérifiez votre email.', 'success');

            // Reset form
            this.registerForm.reset();
            this.focusedFields.clear();
          },
          error: (error: any) => {
            console.error('Erreur d\'inscription:', error);
            this.handleRegistrationError(error);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  private handleRegistrationError(error: any): void {
    if (error.status === 422) {
      // Validation errors from server
      if (error.error?.errors) {
        const errors = error.error.errors;
        if (errors.email) {
          this.errorMessage = 'Cette adresse email est déjà utilisée';
        } else if (errors.password) {
          this.errorMessage = 'Le mot de passe ne respecte pas les critères de sécurité';
        } else {
          this.errorMessage = 'Les données saisies ne sont pas valides';
        }
      } else {
        this.errorMessage = 'Les données saisies ne sont pas valides';
      }
    } else if (error.status === 429) {
      this.errorMessage = 'Trop de tentatives d\'inscription. Veuillez réessayer plus tard';
    } else if (error.status === 0) {
      this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet';
    } else {
      this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer';
    }

    this.showMessage(this.errorMessage, 'error');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmationVisibility(): void {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
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
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onTermsClick(event: Event): void {
    event.preventDefault();
    this.showMessage('Conditions d\'utilisation - Fonctionnalité bientôt disponible', 'info');
  }

  onPrivacyClick(event: Event): void {
    event.preventDefault();
    this.showMessage('Politique de confidentialité - Fonctionnalité bientôt disponible', 'info');
  }

  /**
   * Close success modal
   */
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
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

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle'
    };

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type as keyof typeof colors] || colors.info};
      color: ${type === 'warning' ? '#212529' : 'white'};
      padding: 1rem 1.5rem;
      border-radius: 12px;
      z-index: 10001;
      font-weight: 500;
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 350px;
      word-wrap: break-word;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;

    const icon = document.createElement('i');
    icon.className = `fa ${icons[type as keyof typeof icons] || icons.info}`;
    icon.style.fontSize = '1.1rem';

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(textSpan);

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
    }, 5000);
  }
}