import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
  num: string;
  title: string;
  description: string;
  meta: string;
}

interface Property {
  feature?: boolean;
  tags: { label: string; accent?: boolean }[];
  price: string;
  location: string;
  title: string;
  specs: string[];
  svg: 'villa' | 'haussmann' | 'house' | 'building' | 'complex';
}

interface Testimonial {
  quote: string;
  initial: string;
  variant: '' | 'a2' | 'a3';
  name: string;
  role: string;
}

interface Stat {
  value: string;
  unit: string;
  description: string;
  label: string;
}

interface Faq {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('fadeUp') fadeUps!: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  messageSent = false;

  contact = {
    name: '',
    phone: '',
    email: '',
    projectType: "Achat d'un bien",
    message: '',
  };

  activities: Activity[] = [
    {
      num: '01',
      title: 'Achat & intermédiation',
      description:
        "Recherche de biens, négociation, vérification cadastrale et accompagnement notarial jusqu'à la signature. Pour résidents, diaspora et investisseurs.",
      meta: 'Acquisition',
    },
    {
      num: '02',
      title: 'Location courte durée',
      description:
        'Séjours professionnels, diplomatiques et touristiques à Dakar. Biens meublés, service de conciergerie et ménage inclus pour des séjours de 7 nuits à 3 mois.',
      meta: 'Séjour',
    },
    {
      num: '03',
      title: 'Location longue durée',
      description:
        'Gestion locative intégrale : sélection de locataires, état des lieux, recouvrement des loyers et entretien courant. Rapports mensuels transparents.',
      meta: 'Gestion',
    },
    {
      num: '04',
      title: 'Promotion & construction',
      description:
        "Maîtrise d'ouvrage délégué, suivi de chantier et livraison clé en main. Villas individuelles, résidences collectives et programmes mixtes.",
      meta: 'Bâtir',
    },
  ];

  properties: Property[] = [
    {
      feature: true,
      tags: [
        { label: 'Vente', accent: true },
        { label: 'Exclusivité' },
      ],
      price: '480 M FCFA',
      location: 'Les Almadies · Dakar',
      title: 'Villa contemporaine avec piscine',
      specs: ['5 chambres', '420 m²', 'Terrain 800 m²'],
      svg: 'villa',
    },
    {
      tags: [{ label: 'Location' }],
      price: '1,8 M/mois',
      location: 'Plateau',
      title: 'Appartement haussmannien',
      specs: ['3 ch.', '180 m²'],
      svg: 'haussmann',
    },
    {
      tags: [{ label: 'Vente' }],
      price: '95 M FCFA',
      location: 'Ngor',
      title: 'Maison de famille',
      specs: ['4 ch.', '240 m²'],
      svg: 'house',
    },
    {
      tags: [{ label: 'Location' }],
      price: '950 K/mois',
      location: 'Mermoz',
      title: 'Studio meublé — courte durée',
      specs: ['1 ch.', '55 m²'],
      svg: 'building',
    },
    {
      tags: [{ label: 'Construction', accent: true }],
      price: 'Sur plan',
      location: 'Diamniadio',
      title: 'Résidence Atlantique · 24 lots',
      specs: ['T3 — T5', 'Livraison 2026'],
      svg: 'complex',
    },
  ];

  stats: Stat[] = [
    {
      value: '320',
      unit: '+',
      description:
        'Transactions accompagnées depuis la fondation du groupe en 2007.',
      label: 'Transactions',
    },
    {
      value: '17',
      unit: 'ans',
      description:
        "D'expérience continue sur le marché immobilier de Dakar et de la Petite Côte.",
      label: 'Expérience',
    },
    {
      value: '12',
      unit: 'Mds',
      description:
        'FCFA de volume annuel géré, entre transactions et mandats de gestion locative.',
      label: 'Volume annuel',
    },
    {
      value: '98',
      unit: '%',
      description:
        'De clients satisfaits qui recommandent nos services à leur entourage.',
      label: 'Satisfaction',
    },
  ];

  testimonials: Testimonial[] = [
    {
      quote:
        "Un accompagnement d'une qualité rare. L'équipe a géré l'intégralité de notre acquisition depuis Paris — de la visite virtuelle jusqu'à la signature chez le notaire.",
      initial: 'A',
      variant: '',
      name: 'Aïcha Diop',
      role: 'Acheteuse · Almadies · 2024',
    },
    {
      quote:
        'Nous confions à TFG la gestion de trois immeubles à Dakar depuis sept ans. Rapports mensuels impeccables, recouvrement sans faille, et zéro mauvaise surprise.',
      initial: 'M',
      variant: 'a2',
      name: 'Moussa Ndiaye',
      role: 'Propriétaire bailleur · depuis 2017',
    },
    {
      quote:
        'Villa livrée dans les délais, budget tenu, finitions soignées. Le suivi de chantier hebdomadaire par photos nous a rassurés tout au long des 14 mois de construction.',
      initial: 'F',
      variant: 'a3',
      name: 'Fatou & Cheikh Sall',
      role: 'Construction · Saly · 2023',
    },
  ];

  faqs: Faq[] = [
    {
      question: "Puis-je acheter un bien depuis l'étranger sans me déplacer ?",
      answer:
        "Oui. Nous accompagnons chaque année une trentaine de clients de la diaspora depuis la France, les États-Unis, l'Italie ou le Canada. Visites vidéo en direct, procuration notariée, suivi administratif complet — vous signez à distance et recevez les clés à votre arrivée.",
    },
    {
      question: "Quels sont vos frais d'agence ?",
      answer:
        "Nos honoraires sont transparents et fixés à l'avance : 5 % HT pour les transactions de vente, un mois de loyer pour les locations longue durée, et 12 % du loyer annuel pour nos mandats de gestion locative. Pas de frais cachés, pas de commission sur les travaux.",
    },
    {
      question: 'Dans quelles zones géographiques intervenez-vous ?',
      answer:
        'Notre zone principale couvre Dakar et sa banlieue (Plateau, Almadies, Ngor, Mermoz, Fann, Sacré-Cœur, Yoff, Ouakam) ainsi que la Petite Côte (Saly, Somone, Mbour) et Diamniadio. Pour les programmes de construction, nous intervenons sur l’ensemble du territoire sénégalais.',
    },
    {
      question: 'Comment garantissez-vous la validité des titres de propriété ?',
      answer:
        'Chaque bien que nous proposons fait l’objet d’une vérification cadastrale complète auprès de la Conservation Foncière avant sa mise en vente. Nous travaillons avec un réseau de notaires partenaires qui auditent chaque dossier avant signature. Aucun compromis sur ce point.',
    },
    {
      question: 'Proposez-vous un service de construction clé en main ?',
      answer:
        "Oui. Notre pôle construction prend en charge l'intégralité du projet : terrain, permis de construire, architecte, maîtrise d'œuvre, suivi de chantier hebdomadaire et livraison. Durée moyenne pour une villa : 12 à 16 mois selon la taille et les finitions choisies.",
    },
    {
      question: 'Puis-je déléguer complètement la gestion de mon bien en location ?',
      answer:
        "Absolument. Notre mandat de gestion locative couvre la recherche et la sélection de locataires, la rédaction du bail, l'état des lieux, le recouvrement des loyers, l'entretien courant et la restitution des fonds. Vous recevez un rapport mensuel détaillé et votre loyer net sur votre compte, que vous soyez à Dakar ou à l'étranger.",
    },
  ];

  toggleFaq(index: number): void {
    const wasOpen = this.faqs[index].open;
    this.faqs.forEach((f) => (f.open = false));
    if (!wasOpen) this.faqs[index].open = true;
  }

  submitContact(): void {
    this.messageSent = true;
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.fadeUps.forEach((el) => this.observer!.observe(el.nativeElement));
    this.fadeUps.changes.subscribe(() => {
      this.fadeUps.forEach((el) => {
        if (!el.nativeElement.classList.contains('in')) {
          this.observer!.observe(el.nativeElement);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
