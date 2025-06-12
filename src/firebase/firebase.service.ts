import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      throw new UnauthorizedException('Failed to delete Firebase user');
    }
  }
}
