import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirmation';
  @Input() subtitle: string = 'Êtes-vous sûr de vouloir effectuer cette action?';
  @Input() confirmButtonText: string = 'Confirmer';
  @Input() cancelButtonText: string = 'Annuler';
  @Input() confirmButtonClass: string = 'btn-danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}