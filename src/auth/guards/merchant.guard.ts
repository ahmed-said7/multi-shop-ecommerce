import { JwtService } from '@nestjs/jwt';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { MerchantPayload } from 'src/merchant/merchant.service';
import { UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private readonly logger = new Logger(MerchantGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = request.header('authorization').split(' ')[1];

    const isValidToken = await this.validate(token);

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const payload = await this.jwtService.verifyAsync<MerchantPayload>(token);

    if ( !payload || !payload.userId ) {
      return false;
    }

    if (payload.role !== UserRole.MERCHANT) {
      return false;
    }

    request.user = { role:UserRole.MERCHANT , _id:payload.userId };

    return true;
  }

  async validate(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
      return true; // Token is valid
    } catch (error) {
      return false; // Token is invalid
    }
  }
}
