import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from './email/email.service';
import { User } from './schemas/user_schema';

import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { ValidateObjectIdPipe } from 'src/pipes/validate-object-id.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.emailService.emailOTPCode(
      createUserDto.email,
      createUserDto.name,
    );

    return this.userService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Request() req) {
    const user = req.user;

    return await this.authService.login(user);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Param('page') page: number, @Body('userId') userId: string) {
    return this.userService.findAll(userId, page);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  findOneUser(@Body('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @Body('userId') userId: string) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.userService.remove(id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/fav/:id')
  addFavorite(
    @Param('id', ValidateObjectIdPipe) itemId: string,
    @Body('userId') userId: string,
  ) {
    return this.userService.addFav(itemId, userId);
  }
}
