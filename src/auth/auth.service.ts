import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UserService } from './user.service';
import { User } from 'src/user/schemas/user_schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      userId: user?.['_id'],
      sub: {
        name: user.name,
      },
    };

    user.password = undefined;

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }
  async refreshToken(user: User) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
