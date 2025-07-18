import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { API_URL } from '../../config/endpoints/api';

@Controller(API_URL.AUTH.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_URL.AUTH.LOGIN)
  async login(@Body() user: { email: string; password: string }) {
    console.log(user);
    return this.authService.login(user);
  }

  @Post(API_URL.AUTH.LOGOUT)
  async logout(@Query('id_token') id_token: string) {
    return this.authService.logout(id_token);
  }
}
