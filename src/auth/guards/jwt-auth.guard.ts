import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import mongoose from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user_schema';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

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

    const user = await this.userModel.findById(decodedToken.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.body.userId = decodedToken.userId;
    if (user.role === 'shop_owner') request.body.shopId = user.shopId;
    request.body.userRole = user.role;
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

  private decodeToken(token: string) {
    return this.jwtService.decode<{
      userId: string;
    }>(token);
  }
}
