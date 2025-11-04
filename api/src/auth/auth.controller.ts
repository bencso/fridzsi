import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BodyLogin } from './dto/login.dto';
import { BodyRegistration } from './dto/registration.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PasswordChangeBody } from './dto/password.dto';
import { AuthGuard } from './auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: BodyLogin,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.authService.login(body, request, response);
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  registration(@Body() body: BodyRegistration) {
    return this.authService.registration(body);
  }

  @Post('passwordChange')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  passwordChange(@Body() body: PasswordChangeBody, @Req() request: Request) {
    return this.authService.passwordChange(body, request);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Req() request: Request,
    @Body() body: { refreshToken: string },
  ) {
    return this.authService.refresh(request, body);
  }

  @Get('valid')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  validUser(@Req() request: Request) {
    return this.authService.validation(request);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getMe(@Req() request: Request) {
    return this.authService.getMe(request);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() response: Response, @Req() request: Request) {
    return this.authService.logout(response, request);
  }
}
