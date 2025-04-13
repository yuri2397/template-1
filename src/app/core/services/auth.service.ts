import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiClientService } from './api-client.service';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiClientService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observables publics exposés aux composants
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    super();
    this.baseUrl = 'auth';
    this.checkAuthState();
  }

  /**
   * Vérifie l'état d'authentification à partir du token stocké
   */
  private checkAuthState(): void {
    const token = this.getToken();
    const user = this.getUser();

    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Connexion utilisateur
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   */
  login(email: string, password: string): Observable<any> {
    return this.post('login', { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // Utiliser les méthodes existantes pour stocker le token
          this.setToken(response.token);

          // Stocker l'utilisateur
          if (response.user) {
            this.setUser(response.user);
            this.currentUserSubject.next(response.user);
          }

          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): Observable<any> {
    return this.post('logout', {}).pipe(
      tap(() => {
        // Nettoyer les données d'authentification
        this.removeToken();
        this.removeUser();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  /**
   * Récupérer l'utilisateur actuel depuis l'API
   */
  getCurrentUser(): Observable<any> {
    return this.get('user', {}).pipe(
      tap(user => {
        if (user) {
          this.setUser(user);
          this.currentUserSubject.next(user as User);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Récupérer l'utilisateur actuel (depuis le BehaviorSubject)
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param role Rôle à vérifier
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUserValue();
    return !!user && Array.isArray(user.roles) && user.roles.includes(role);
  }

  /**
   * Vérifier si l'utilisateur a une permission spécifique
   * @param permission Permission à vérifier
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUserValue();
    return !!user && Array.isArray(user.permissions) && user.permissions.includes(permission);
  }
}
