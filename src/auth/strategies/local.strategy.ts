import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validarUsuario(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
