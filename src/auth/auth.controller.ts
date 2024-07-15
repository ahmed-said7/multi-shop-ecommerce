import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Roles } from 'src/common/decorator/roles';
import { AuthUser } from 'src/common/decorator/param.decorator';
import { AllRoles, IAuthUser } from 'src/common/enums';
import { jwtTokenService } from 'src/jwt/jwt.service';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwt:jwtTokenService
  ) {}

  @Post('login')
  async login(@Body() body:LoginUserDto) {
    return this.authService.loginUser(body);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Roles(AllRoles.ADMIN,AllRoles.USER,AllRoles.MERCHANT)
  async refreshToken(@AuthUser() user:IAuthUser ) {
    return this.jwt.createTokens({
      userId: user._id,
      role:user.role
    })
  }
}
