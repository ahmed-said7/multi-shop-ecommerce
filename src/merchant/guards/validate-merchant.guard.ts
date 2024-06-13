import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import type { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/user/schemas/user_schema';

export type TokenPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  gender: string;
};

@Injectable()
export class ValidateMerchantGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.header('authorization').split(' ').at(1);

    if (!token) {
      return false;
    }

    const payload = await this.authService.verifyToken<TokenPayload>(token);

    if (payload?.role !== UserRole.MERCHANT) {
      return false;
    }

    request.body = {
      ...request.body,
      ...payload,
    };

    return true;
  }
}
