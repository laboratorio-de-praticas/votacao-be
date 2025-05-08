import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido ou mal formatado');
    }

    try {
      const response = await axios.get(
        'http://localhost:3000/v1/user/profile',
        {
          headers: { Authorization: authHeader },
          timeout: 5000,
        },
      );

      if (response.status !== 200 || !response.data.email) {
        throw new ForbiddenException(
          'Resposta inválida do serviço de autenticação',
        );
      }

      request['user'] = response.data;
      return true;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            throw new ForbiddenException('Token inválido ou expirado');
          case 500:
            throw new ForbiddenException(
              'Erro interno no serviço de autenticação',
            );
          default:
            throw new ForbiddenException('Erro na validação do token');
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new ForbiddenException('Timeout na validação do token');
      } else {
        throw new ForbiddenException('Serviço de autenticação indisponível');
      }
    }
  }
}
