import { ApiClientService } from "./api-client.service";

export class AuthService  extends ApiClientService {
  constructor() {
    super();
    this.baseUrl = 'auth';
  }

  login(email: string, password: string) {
    return this.post('login', { email, password });
  }


}
