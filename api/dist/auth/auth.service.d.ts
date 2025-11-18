import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BodyLogin, LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { BodyRegistration, RegistrationDto } from './dto/registration.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ReturnUserDto } from '../users/dto/return.dto';
import { UUID } from 'crypto';
import { SessionService } from '../sessions/sessions.service';
import { UserData } from '../sessions/entities/sessions.entity';
import { ReturnDataDto, ReturnDto } from '../dto/return.dto';
import { DataSource } from 'typeorm';
import { PasswordChangeBody } from './dto/password.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    private readonly sessionsService;
    private readonly dataSource;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, sessionsService: SessionService, dataSource: DataSource);
    login(body: BodyLogin, request: Request, response: Response): Promise<Response<ReturnDataDto> | UnauthorizedException>;
    passwordChange(body: PasswordChangeBody, request: Request): Promise<ReturnDto | UnauthorizedException>;
    signIn(email: string, password: string, request: Request): Promise<LoginDto | UnauthorizedException>;
    registration(body: BodyRegistration): Promise<RegistrationDto | ConflictException>;
    refresh(request: Request, body: {
        refreshToken: string;
    }): Promise<object | UnauthorizedException>;
    createAccessToken(user: ReturnUserDto, user_data: UserData): Promise<string>;
    createRefreshToken(payload: {
        sub: number;
        tokenId: UUID;
    }): Promise<string>;
    logout(response: Response, request: Request): Promise<Response<ReturnDto>>;
    validation(request: Request): Promise<ReturnDataDto>;
    getMe(request: Request): Promise<ReturnDataDto>;
}
