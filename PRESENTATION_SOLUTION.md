# PROPOSITION DE SOLUTION DE DIGITALISATION

## Solution complète de gestion et de commande pour restaurant

---

**Proposé par :** Digita SN — Entreprise de Digitalisation
**Destiné à :** [Nom du Restaurant] — Dakar, Sénégal
**Date :** Avril 2026
**Version :** 1.0

---

## 1. CONTEXTE ET ENJEUX

Le secteur de la restauration à Dakar connaît une transformation rapide portée par l'essor du numérique, l'augmentation des commandes en ligne et les nouvelles attentes des clients en matière de rapidité, de transparence et d'expérience.

Pour accompagner votre restaurant dans cette transition, **Digita SN** vous propose une solution digitale complète, sur mesure, adaptée au contexte sénégalais (moyens de paiement locaux, langues, habitudes de consommation).

### Objectifs du projet

- Moderniser la prise de commande et le service
- Fidéliser la clientèle et développer de nouveaux canaux de vente
- Automatiser la gestion interne (stocks, caisse, personnel)
- Offrir une offre B2B aux entreprises pour les repas de leurs employés
- Gagner en visibilité grâce aux données et statistiques

---

## 2. VUE D'ENSEMBLE DE LA SOLUTION

La solution proposée se compose de **trois applications interconnectées**, partageant une base de données centralisée et communiquant en temps réel.

```
                    ┌─────────────────────────┐
                    │    BACK-END CENTRAL     │
                    │  (API + Base de données)│
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐
    │  APP WEB   │       │  APP ADMIN  │       │ APP PARTNER │
    │  CLIENTS   │       │ RESTAURANT  │       │ ENTREPRISES │
    └────────────┘       └─────────────┘       └─────────────┘
```

### Les 3 modules

| Module | Public cible | Objectif principal |
|--------|--------------|--------------------|
| **App Web Client** | Particuliers, consommateurs | Commander en ligne, réserver, fidélité |
| **App Admin** | Gérant, staff, cuisine, caisse | Gérer le restaurant au quotidien |
| **App Partner** | Entreprises, groupes, RH | Gérer les repas et factures des employés |

---

## 3. MODULE 1 — APPLICATION WEB CLIENT (Responsive Mobile)

**Public :** clients particuliers
**Technologie :** application web progressive (PWA), accessible depuis tout smartphone, tablette ou ordinateur, sans téléchargement.

### 3.1 Découverte et inscription

- Page d'accueil attractive avec mise en avant des plats du jour
- Inscription rapide (email, téléphone, numéro Orange Money / Wave)
- Connexion via téléphone + OTP par SMS
- Authentification via Google / Facebook (optionnel)
- Profil personnel modifiable (adresses, préférences, allergènes)

### 3.2 Menu et catalogue

- Menu interactif avec photos haute qualité des plats
- Catégorisation (entrées, plats, desserts, boissons, menus du jour)
- Fiche détaillée par plat : ingrédients, allergènes, prix, temps de préparation
- Filtres : végétarien, sans porc, halal, sans gluten, etc.
- Recherche intelligente par nom, ingrédient ou catégorie
- Disponibilité en temps réel (plat en rupture = masqué automatiquement)
- Menus en plusieurs langues (français, wolof, anglais)

### 3.3 Commande en ligne

- Trois modes de commande :
  - **Sur place** (scan du QR code à table)
  - **À emporter** (click & collect)
  - **Livraison** à domicile ou au bureau
- Panier dynamique avec personnalisation des plats (sans oignon, bien cuit, etc.)
- Instructions spéciales pour la cuisine
- Estimation du temps de préparation et de livraison
- Suivi de commande en temps réel (préparation → cuisson → prêt → livraison)

### 3.4 Réservation de table

- Calendrier interactif des disponibilités
- Choix du nombre de convives et de l'heure
- Sélection de la zone (terrasse, salle, VIP)
- Confirmation instantanée par SMS et email
- Gestion des annulations et modifications

### 3.5 Paiement

- **Mobile Money :** Orange Money, Wave, Free Money
- **Cartes bancaires :** Visa, Mastercard (via passerelle sécurisée)
- **Paiement à la livraison :** espèces ou TPE mobile
- **Portefeuille intégré** (crédit restaurant rechargeable)
- Facture électronique envoyée par email

### 3.6 Fidélité et promotions

- Programme de points de fidélité (1 FCFA dépensé = 1 point)
- Récompenses, badges et niveaux (Bronze, Argent, Or)
- Coupons et codes promo
- Offres spéciales (happy hour, menu du jour, anniversaire client)
- Parrainage : inviter un ami = bonus pour les deux

### 3.7 Interaction et engagement

- Avis et notations après chaque commande
- Galerie photos et vidéos des plats
- Partage sur les réseaux sociaux
- Notifications push (nouveaux plats, promotions, statut commande)
- Chat / support client intégré (WhatsApp ou chat direct)

### 3.8 Historique

- Historique complet des commandes
- Re-commande en 1 clic
- Téléchargement des factures en PDF
- Suivi des points de fidélité

---

## 4. MODULE 2 — APPLICATION ADMIN RESTAURANT

**Public :** propriétaire, gérant, serveurs, cuisiniers, caissiers
**Technologie :** application web + écrans dédiés (tablettes cuisine, bornes caisse)
**Gestion des rôles :** chaque utilisateur accède uniquement aux fonctions qui le concernent.

### 4.1 Tableau de bord (Dashboard)

- Chiffre d'affaires en temps réel (jour, semaine, mois, année)
- Nombre de commandes en cours / terminées
- Plats les plus vendus
- Taux de fidélisation et nouveaux clients
- Alertes (rupture stock, commande en retard, etc.)
- Comparatifs et tendances

### 4.2 Gestion du menu

- Création, modification, suppression de plats et catégories
- Upload photos multiples par plat
- Gestion des prix et promotions programmées
- Gestion des menus du jour / événements
- Activation/désactivation rapide (rupture, fin de service)
- Gestion multilingue du catalogue

### 4.3 Gestion des commandes

- Réception en temps réel de toutes les commandes (sur place, à emporter, livraison)
- Affichage cuisine (Kitchen Display System) sur tablette :
  - Liste des commandes en cours
  - Statut : reçue → en préparation → prête
  - Notification sonore à chaque nouvelle commande
- Affichage serveur : assignation des tables, suivi du service
- Impression automatique des tickets en cuisine et au bar
- Gestion des annulations et remboursements

### 4.4 Gestion des tables et réservations

- Plan interactif du restaurant (salle, terrasse, VIP)
- Statut des tables en temps réel (libre, occupée, à nettoyer)
- Gestion des réservations (calendrier, liste d'attente)
- Assignation serveur / table
- Durée moyenne du service par table

### 4.5 Gestion de la caisse (POS)

- Encaissement rapide multi-moyens de paiement
- Ouverture / fermeture de caisse journalière
- Ticket électronique ou imprimé
- Gestion des pourboires
- Rapport Z de fin de journée
- Archivage automatique des transactions

### 4.6 Gestion des stocks

- Inventaire des ingrédients et boissons
- Décrément automatique selon les ventes (recettes liées aux plats)
- Alertes de stock bas
- Commandes fournisseurs et historique d'achats
- Gestion des pertes et démarques
- Valorisation du stock en FCFA

### 4.7 Gestion des employés

- Base de données du personnel
- Gestion des rôles et permissions (admin, gérant, serveur, cuisinier, caissier)
- Pointage et horaires
- Suivi des performances (commandes servies, ventes par serveur)
- Gestion de la paie (optionnel)

### 4.8 Gestion clients et CRM

- Base clients complète avec historique
- Segmentation (VIP, réguliers, nouveaux)
- Campagnes marketing ciblées (SMS, email, push)
- Gestion du programme de fidélité
- Analyse du comportement et préférences

### 4.9 Gestion de la livraison

- Module de gestion des livreurs
- Attribution automatique ou manuelle des courses
- Suivi GPS en temps réel
- Calcul des frais selon la distance
- Évaluation des livreurs

### 4.10 Rapports et statistiques

- Rapports financiers (CA, marges, charges)
- Rapports produits (best-sellers, plats à faible rotation)
- Rapports clients (fréquence, panier moyen)
- Rapports personnel
- Export Excel / PDF
- Intégration comptable possible

### 4.11 Paramètres généraux

- Informations du restaurant (logo, coordonnées, horaires)
- Modes de paiement acceptés
- Zones et tarifs de livraison
- Taxes et TVA
- Personnalisation de l'interface client
- Notifications et alertes

---

## 5. MODULE 3 — APPLICATION PARTNER (Entreprises / Groupes)

**Public :** entreprises, organisations, institutions ayant un contrat avec le restaurant
**Objectif :** permettre aux entreprises de gérer les repas offerts/remboursés à leurs employés et de recevoir des factures consolidées.

### 5.1 Espace entreprise

- Création d'un compte entreprise dédié
- Profil (raison sociale, NINEA, RC, adresse, contact facturation)
- Gestion de plusieurs administrateurs (RH, comptabilité, direction)
- Logo et branding personnalisé

### 5.2 Gestion des employés

- Ajout d'employés manuellement ou par import Excel/CSV
- Attribution d'un **badge / carte virtuelle** ou **QR code personnel** à chaque employé
- Définition d'un **plafond repas** par employé (journalier, hebdo, mensuel)
- Répartition par service / département / site
- Activation / désactivation d'un employé en 1 clic (ex. départ, congé)

### 5.3 Gestion des contrats et budgets

- Définition d'une **enveloppe budgétaire** globale ou par département
- Règles de consommation :
  - Plafond par repas
  - Plats autorisés / interdits
  - Horaires autorisés (ex. seulement 12h–14h)
  - Jours autorisés (ex. jours ouvrables uniquement)
- Pré-paiement, post-paiement ou paiement à la facture
- Alerte en cas de dépassement

### 5.4 Suivi des commandes

- Tableau de bord des commandes des employés en temps réel
- Filtres par employé, département, période, type de commande
- Détail par commande (plats, montant, heure, lieu)
- Exportation des données

### 5.5 Facturation

- **Facturation consolidée** mensuelle ou personnalisée
- Factures conformes à la législation sénégalaise (NINEA, TVA)
- Téléchargement au format PDF
- Historique complet des factures
- Paiement en ligne (virement, mobile money, carte)
- Relances automatiques

### 5.6 Statistiques et rapports

- Consommation par employé, département, site
- Évolution mensuelle des dépenses
- Plats les plus consommés par l'entreprise
- Comparatif budget prévu / consommé
- Export comptable

### 5.7 Notifications

- Alerte dépassement de plafond
- Rappel échéance de paiement
- Rapport hebdomadaire / mensuel envoyé par email
- Notifications aux employés (solde restant, nouveaux menus)

### 5.8 Cas d'usage

- **Entreprises** offrant des repas à leurs collaborateurs
- **Écoles et universités** gérant la cantine des étudiants
- **Hôpitaux** gérant les repas du personnel soignant
- **Événements** (séminaires, conférences, mariages) avec liste d'invités pré-chargée
- **Groupes d'amis** ou associations organisant des repas partagés

---

## 6. FONCTIONNALITÉS TRANSVERSES

### 6.1 Sécurité

- Chiffrement des données (HTTPS, TLS 1.3)
- Authentification à deux facteurs (2FA) pour les administrateurs
- Sauvegardes automatiques quotidiennes
- Conformité RGPD et loi sénégalaise sur la protection des données
- Journalisation des actions sensibles (audit trail)

### 6.2 Multi-plateforme

- Application web responsive (mobile, tablette, desktop)
- Compatible Chrome, Safari, Firefox, Edge
- PWA installable sur l'écran d'accueil (sans passer par un store)
- Option d'applications mobiles natives (Android / iOS) en phase 2

### 6.3 Intégrations

- Passerelles de paiement : Orange Money, Wave, Free Money, PayDunya, InTouch
- SMS : Twilio, Africa's Talking, Orange SMS
- Email : SendGrid, Mailgun
- Google Maps pour les livraisons
- WhatsApp Business API pour le support
- Logiciels de comptabilité (Sage, Ciel, etc.)

### 6.4 Support et formation

- Formation initiale du personnel (2 à 3 sessions)
- Manuel utilisateur (PDF + vidéos tutoriels)
- Support technique (WhatsApp, téléphone, email)
- Maintenance évolutive et corrective
- Hébergement sécurisé et monitoring 24/7

---

## 7. AVANTAGES POUR LE RESTAURANT

| Avantage | Bénéfice concret |
|----------|------------------|
| **Gain de temps** | Moins d'erreurs, commandes directement en cuisine |
| **Augmentation du CA** | Nouveaux canaux de vente (livraison, entreprises) |
| **Fidélisation** | Programme de points et offres personnalisées |
| **Meilleure gestion** | Stocks, caisse, employés centralisés |
| **Visibilité** | Statistiques précises pour décider vite |
| **Image moderne** | Positionnement premium sur le marché dakarois |
| **Revenus B2B** | Contrats récurrents avec entreprises |

---

## 8. PHASES DE DÉPLOIEMENT

### Phase 1 — Conception et cadrage (2 semaines)
- Ateliers avec le client
- Maquettes UI/UX
- Validation du cahier des charges

### Phase 2 — Développement (8 à 10 semaines)
- Back-end et API
- Application web client
- Application admin
- Application partner

### Phase 3 — Tests et recette (2 semaines)
- Tests fonctionnels
- Tests de charge
- Corrections

### Phase 4 — Formation et déploiement (1 à 2 semaines)
- Formation du personnel
- Mise en production
- Accompagnement

### Phase 5 — Suivi et évolution (continu)
- Support technique
- Nouvelles fonctionnalités
- Mises à jour régulières

**Durée totale estimée : 3 à 4 mois**

---

## 9. TECHNOLOGIES UTILISÉES

- **Front-end :** Angular / Tailwind CSS (responsive, PWA)
- **Back-end :** Node.js ou Laravel (API REST sécurisée)
- **Base de données :** PostgreSQL / MySQL
- **Hébergement :** Cloud sécurisé (AWS, OVH ou serveur local selon choix)
- **Notifications temps réel :** WebSocket / Firebase
- **Sécurité :** HTTPS, JWT, OAuth2

---

## 10. POURQUOI DIGITA SN ?

- **Expertise locale** : nous connaissons le marché sénégalais
- **Solutions sur mesure** : adaptées à vos besoins, pas un produit générique
- **Support de proximité** : équipe basée à Dakar, réactive
- **Intégration des moyens de paiement locaux** dès le premier jour
- **Accompagnement durable** : nous sommes votre partenaire, pas un simple prestataire

---

## 11. PROCHAINES ÉTAPES

1. Validation de la présente proposition
2. Signature du contrat et paiement d'acompte
3. Lancement des ateliers de cadrage
4. Démarrage du développement

---

**Contact Digita SN**
📞 Téléphone : [à compléter]
📧 Email : contact@digitasn.sn
🌐 Site web : www.digitasn.sn
📍 Adresse : Dakar, Sénégal

---

*Ce document est la propriété de Digita SN. Toute reproduction ou diffusion sans autorisation est interdite.*
