import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from 'src/sessions/sessions.service';

// @UseGuards(AuthGuard) - igy lehet majd használni a guardot, tulajdonképpen a Guard az egy őr, aki azt nézi hogy hozzáférhet-e az adott user a végponthoz.
//! Ha jól értem: nest guard = express middleware
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Request letárolása
    const request = context.switchToHttp().getRequest<Request>();
    // Kiszedjük a tokent az authorizationből
    try {
      const isValid = await this.sessionService.validateAccessToken(request);
      if (isValid == null)
        throw new UnauthorizedException({
          message: 'Érvénytelen bejelentkezési adat(ok)',
          status: 401,
        });
      else return isValid;
    } catch {
      throw new UnauthorizedException({
        message: 'Érvénytelen bejelentkezési adat(ok)',
        status: 401,
      });
    }
  }
}
