import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login.dto';
import { jwtTokenService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private jwt:jwtTokenService
  ) {}

  async validateUser(email: string, password: string) {
    const { foundUser : user } = await this.userService.findOneWithEmail(email);
    const valid=await bcrypt.compare(password, user.password);
    if ( ! valid ) {
      return false;
    };
    return true;
  };

  async loginUser(body:LoginUserDto) {
    const { foundUser : user } = await this.userService.findOneWithEmail(body.email);
    const valid=await bcrypt.compare(body.password, user.password);
    if ( ! valid ) {
      throw new HttpException("email or password is not correct",400)
    };
    const {accessToken,refreshToken}=await this.jwt.createTokens({
      userId: user._id.toString(),
      role:user.role
    });
    return { accessToken , refreshToken };
  }

  async verifyToken(token: string) {
    return await this.jwtService.decode(token);
  };

};
