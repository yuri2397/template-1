import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0);

    // Add smooth scroll behavior for better UX
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    // Add intersection observer for scroll animations if needed
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.value-card, .team-member, .story-section, .mission-section');
    animateElements.forEach(el => observer.observe(el));
  }
}