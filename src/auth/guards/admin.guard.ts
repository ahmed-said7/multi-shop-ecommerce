import type { Request } from 'express';

import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { User, UserDocument, UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.header('authorization').split(' ')[1];

    if (!token) {
      return false;
    }

    let tokenData: { userId: string };

    try {
      tokenData = await this.jwtService.verifyAsync(token);
    } catch {
      return false;
    }

    if (!tokenData.userId) {
      return false;
    }

    const user = await this.userModel.findById(tokenData.userId);

    if (!user) {
      return false;
    }

    if (user.role !== UserRole.ADMIN) {
      return false;
    }

    return true;
  }
}
