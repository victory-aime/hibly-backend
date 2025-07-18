import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/services';
import { UsersService } from '../users/users.service';
import { JwtTokenService } from '../jwt/jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Valide les identifiants utilisateur.
   * @throws UnauthorizedException si l'email ou le mot de passe est invalide.
   */
  async validateUser(email: string, password: string) {
    const { user } = await this.usersService.findUser(undefined, email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe invalide');
    }

    return user;
  }

  /**
   * Rafraîchit les tokens JWT à partir d'un refresh token valide.
   * @throws UnauthorizedException si le refresh token est absent ou invalide.
   */
  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtTokenService.verifyRefreshToken(refreshToken);

      console.log('payload', payload);

      const { user } = await this.usersService.findUser(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Aucun Refresh Token trouvé');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh Token invalide');
      }

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtTokenService.generateAccessToken({
          id: user.id,
          role: user.companyRole?.baseRole,
          permissions: user.companyRole?.permissions.map(
            (p) => p.permission.name,
          ),
        }),
        this.jwtTokenService.generateRefreshToken(user.id),
      ]);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: await bcrypt.hash(newRefreshToken, 12) },
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Échec du rafraîchissement de token');
    }
  }

  /**
   * Génère des tokens et connecte l'utilisateur.
   */
  async login(credentials: { email: string; password: string }): Promise<{
    message: string;
    access_token: string;
    refresh_token: string;
  }> {
    try {
      const user = await this.validateUser(
        credentials.email,
        credentials.password,
      );

      const access_token = this.jwtTokenService.generateAccessToken({
        id: user.id,
        role: user.companyRole?.baseRole,
        permissions: user.companyRole?.permissions.map(
          (p) => p.permission.name,
        ),
      });

      const refresh_token = this.jwtTokenService.generateRefreshToken(user.id);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: await bcrypt.hash(refresh_token, 12) },
      });

      return {
        message: 'Connexion réussie',
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Échec de la connexion');
    }
  }

  /**
   * Déconnecte l'utilisateur en supprimant son refresh token.
   */
  async logout(userId: string): Promise<{ message: string }> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      return {
        message: 'Déconnexion réussie',
      };
    } catch {
      throw new UnauthorizedException('Échec de la déconnexion');
    }
  }
}
