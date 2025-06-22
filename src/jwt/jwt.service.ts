import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class jwtTokenService {
  constructor(private Jwt: JwtService) {}
  async createTokens(payload: { userId: string; role: string }) {
    const accessToken = await this.Jwt.signAsync(payload, { expiresIn: '3d' });
    const refreshToken = await this.Jwt.signAsync(payload, {
      expiresIn: '80d',
    });
    return { accessToken, refreshToken };
  }
}
