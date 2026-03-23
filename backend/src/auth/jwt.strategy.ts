import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['jwt'];
            if(token) console.log("[JwtStrategy] Found HTTPOnly Cookie JWT!");
          }
          if (!token) console.log("[JwtStrategy] JWT Cookie MISSING from incoming request!");
          return token || ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log("[JwtStrategy] Extracted Payload:", payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      console.log("[JwtStrategy] User ID not found in database! Throwing 401.");
      throw new UnauthorizedException();
    }
    console.log("[JwtStrategy] User validated successfully:", user.email);
    const { password, ...result } = user;
    return result;
  }
}
