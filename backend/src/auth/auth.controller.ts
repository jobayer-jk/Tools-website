import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokenPayload = await this.authService.login(user);
    
    // Most Secure: Issue JWT via HttpOnly Cookie
    res.cookie('jwt', tokenPayload.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { 
      message: 'Logged in successfully',
      user: { id: user.id, email: user.email, role: user.role },
      token: tokenPayload.access_token
    };
  }
}
