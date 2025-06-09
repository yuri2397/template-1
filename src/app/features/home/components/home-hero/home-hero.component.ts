import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss'
})
export class HomeHeroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoplayInterval: any;
  isHovered = false;

  slides = [
    {
      id: 1,
      image: 'assets/img/1.jpg',
      title: 'Collection Élégance',
      subtitle: 'Hijabs Premium',
      description: 'Découvrez notre collection de hijabs en soie et coton, alliant tradition et modernité.',
      price: '25.000 F CFA',
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 2,
      image: 'assets/img/2.jpg',
      title: 'Style Raffiné',
      subtitle: 'Abayas Modernes',
      description: 'Des abayas contemporaines pour la femme moderne qui allie foi et élégance.',
      price: '45.000 F CFA',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 3,
      image: 'assets/img/3.jpg',
      title: 'Tendance Actuelle',
      subtitle: 'Turbans Chic',
      description: 'Turbans et accessoires pour un look sophistiqué au quotidien.',
      price: '15.000 F CFA',
      color: 'from-pink-600 to-rose-500'
    },
    {
      id: 4,
      image: 'assets/img/4.jpg',
      title: 'Nouvelle Collection',
      subtitle: 'Modest Fashion',
      description: 'L\'art de s\'habiller avec élégance tout en respectant ses valeurs.',
      price: '35.000 F CFA',
      color: 'from-rose-500 to-pink-500'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, 4000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  getCurrentSlide() {
    return this.slides[this.currentSlide];
  }
}