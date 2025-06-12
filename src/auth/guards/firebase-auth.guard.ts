// firebase-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class FirebaseGuard implements CanActivate {
  constructor(private readonly FirebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!idToken) throw new UnauthorizedException('IdToken not found');

    try {
      const decodedToken = await this.FirebaseService.verifyIdToken(idToken);
      request.user = decodedToken;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid IdToken');
    }
  }
}
