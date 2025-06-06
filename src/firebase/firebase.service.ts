import { Injectable } from '@nestjs/common';
import { getAdminAuth } from 'firebase.config';
import { Auth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private auth: Auth;

  constructor() {
    this.auth = getAdminAuth();
  }

  async getUserUidByEmail(email: string): Promise<string> {
    const user = await this.auth.getUserByEmail(email);
    return user.uid;
  }
}
