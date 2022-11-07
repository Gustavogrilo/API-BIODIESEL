import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { TokenDto } from './dtos/token.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: AuthDto,
  })
  @ApiCreatedResponse({ type: TokenDto })
  @ApiUnauthorizedResponse({ description: 'Login inválido' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('recuperar-senha')
  @HttpCode(201)
  @ApiBody({
    type: RecoverPasswordDto,
  })
  async sendRecoverPasswordEmail(@Body('login') login: string) {
    if (!login) throw new BadRequestException('login must be a string');

    await this.authService.sendRecoverPasswordEmail(login);

    return;
  }

  @Post('alterar-senha')
  @ApiBody({
    type: ChangePasswordDto,
  })
  async changePassword(
    @Body('token') token: string,
    @Body('senha') password: string,
  ) {
    if (!token) throw new BadRequestException('token must be a string');

    if (!password) throw new BadRequestException('senha must be a string');

    await this.authService.recoverPassword(token, password);

    return;
  }
}
