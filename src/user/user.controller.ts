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
  Req,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from './email/email.service';
import { User } from './schemas/user_schema';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import mongoose from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private readonly emailService: EmailService,
  ) { }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    await this.emailService.emailOTPCode(
      createUserDto.email,
      createUserDto.name,
    );
    return this.userService.register(createUserDto);
  }

  @Post('register/shop')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerShop(@Body() registerData: any) {
    await this.emailService.emailOTPCode(
      registerData.user.email,
      registerData.user.name,
    );
    return this.userService.registerShop(registerData);
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
  findAll(@Param('page') page: number) {
    return this.userService.findAll(page);
  }

  @UseGuards(JwtGuard)
  @Get('one')
  findOneUser(@Body('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch('/checkout/:id')
  checkout(@Param('id') id: string) {
    return this.userService.checkOut(id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') userId: string, @Body('id') deleteId: string) {
    return this.userService.remove(userId, deleteId);
  }

  @UseGuards(JwtGuard)
  @Patch('/fav/:id')
  addFavoriute(@Param('id') itemId: string, @Body('userId') userId: string) {
    return this.userService.addFav(itemId, userId);
  }

  @UseGuards(JwtGuard)
  @Patch('/cart/add')
  addToCart(@Body() itemId: mongoose.Types.ObjectId, @Req() request: Request) {
    return this.userService.addToCart(itemId, request);
  }

  @UseGuards(JwtGuard)
  @Patch('/cart/remove')
  removeFromCart(@Body() itemId: mongoose.Types.ObjectId, @Req() request: Request) {
    return this.userService.removeItemCart(itemId, request);
  }
}
