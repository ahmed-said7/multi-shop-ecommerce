import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = request.headers.authorization.split(' ')[1];
    const isValidToken = await this.validate(token);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const decodedToken = this.decodeToken(token);
    request.body.userId = decodedToken.userId;
    request.body.username = decodedToken.username;
    return true;
  }

  async validate(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true; // Token is valid
    } catch (error) {
      return false; // Token is invalid
    }
  }

  private decodeToken(token: string) {
    return this.jwtService.decode<{ userId: string; username: string }>(token);
  }
}
