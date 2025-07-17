import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload, verify, decode } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AppRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Token manquant ou invalide');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = decode(token, { complete: true });
      if (!decodedToken) {
        throw new ForbiddenException('Token invalide');
      }

      const verifiedToken = verify(
        token,
        process.env.JWT_SECRET!,
      ) as JwtPayload;

      const userRole = verifiedToken.role;

      const hasRole = requiredRoles.includes(userRole);
      if (!hasRole) {
        throw new ForbiddenException(
          `Accès refusé : Rôle(s) requis ${requiredRoles.join(', ')}`,
        );
      }

      return true;
    } catch {
      throw new UnauthorizedException('Erreur de validation du token');
    }
  }
}

export const AllowedRoles = (...roles: string[]) => SetMetadata('roles', roles);
