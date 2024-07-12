import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


import { User } from '../user/schemas/user_schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const { foundUser : user } = await this.userService.findOneWithEmail(email);
    if ( await bcrypt.compare(password, user.password) ) {
      user.password = undefined;
      return user;
    };
    return null;
  }

  async login(user: User) {
    const payload = {
      userId: user?.['_id'],
    };

    user.password = undefined;

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async getToken(data: any) {
    delete data.password;

    return {
      accessToken: await this.jwtService.signAsync(data),
    };
  }

  async verifyToken<T>(token: string) {
    return await this.jwtService.decode<T>(token);
  }

  async refreshToken(user: User) {
    const payload = {
      userId: user?.['_id'],
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
