import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.authService
      .validateUser(username, password)
      .catch(() => {
        throw new BadRequestException('Username or Password isnt right');
      });

    if (!user) {
      throw new BadRequestException('Username or Password isnt right');
    }
    return user;
  }
}
