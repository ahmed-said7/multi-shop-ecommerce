import type { Request } from 'express';

import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { User, UserDocument, UserRole } from 'src/user/schemas/user_schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const id = request.params.id as string;

    if (!id) {
      throw new ForbiddenException('id not provided');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    if (user.role !== UserRole.ADMIN) {
      return false;
    }

    return true;
  }
}
