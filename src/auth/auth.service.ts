import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { getManager } from 'typeorm';

import { join } from 'path';

import { UsuarioService } from 'src/domain/usuario/usuario.service';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenRecuperacaoUsuario } from '../domain/usuario/token-recuperacao-usuario.entity';
import { Usuario } from '../domain/usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validarUsuario(login: string, senha: string): Promise<any> {
    const usuario: Usuario = await this.usuarioService.findByLogin(login);

    if (!usuario)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    const isValid = await usuario.validatePassword(senha);

    if (isValid) return { id: usuario.id };

    return null;
  }

  async login(user: any) {
    const payload = { uid: +user.id };

    return {
      uid: +user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendRecoverPasswordEmail(login: string): Promise<void> {
    const url = 'www.projecttrace.com.br/biodiesel/#/login?alterarSenha=';
    const to = login;
    const user = await this.usuarioService.findByLogin(login);

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    let tokenRecuperacaoUsuario = await getManager().findOne(
      TokenRecuperacaoUsuario,
      {
        where: { usuarioId: user.id },
      },
    );

    if (!tokenRecuperacaoUsuario) {
      tokenRecuperacaoUsuario = new TokenRecuperacaoUsuario({
        usuarioId: user.id,
      });

      await getManager().insert(
        TokenRecuperacaoUsuario,
        tokenRecuperacaoUsuario,
      );
    }

    const recoverToken = tokenRecuperacaoUsuario.token;

    const mail = {
      to,
      subject: 'Biodiesel - Recuperação de senha',
      template: 'recover-password',
      context: {
        url: url + recoverToken + '&userLogin=' + user.login,
      },
      attachments: [
        {
          filename: 'logo_ibsagro.png',
          path: join(
            __dirname,
            '..',
            '..',
            'assets',
            'img',
            'logo_ibsagro.png',
          ),
          cid: 'logoBiodiesel',
        },
        {
          filename: 'authentication.png',
          path: join(
            __dirname,
            '..',
            '..',
            'assets',
            'img',
            'authentication.png',
          ),
          cid: 'recoverPassword',
        },
      ],
    };

    await this.mailerService.sendMail(mail);
  }

  async recoverPassword(token: string, password: string) {
    const tokenRecuperacaoUsuario = await getManager().findOne(
      TokenRecuperacaoUsuario,
      { where: { token } },
    );

    if (!tokenRecuperacaoUsuario)
      throw new NotFoundException('Token inválido.');

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(
        Usuario,
        new Usuario({
          id: +tokenRecuperacaoUsuario.usuarioId,
          senha: password,
        }),
      );

      await transactionalEntityManager.delete(TokenRecuperacaoUsuario, {
        token,
      });
    });
  }
}
