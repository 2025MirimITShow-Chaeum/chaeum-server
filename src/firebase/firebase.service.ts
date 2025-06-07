import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAdminAuth } from 'firebase.config';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private auth: Auth;

  constructor(private configService: ConfigService) {
    this.auth = getAdminAuth();
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return await this.auth.verifyIdToken(idToken);
  }
}
