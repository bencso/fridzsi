import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BodyLogin } from './dto/login.dto';
import { BodyRegistration } from './dto/registration.dto';
import { PasswordChangeBody } from './dto/password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: BodyLogin, request: Request, response: Response): Promise<Response<import("../dto/return.dto").ReturnDataDto, Record<string, any>> | import("@nestjs/common").UnauthorizedException>;
    registration(body: BodyRegistration): Promise<import("./dto/registration.dto").RegistrationDto | import("@nestjs/common").ConflictException>;
    passwordChange(body: PasswordChangeBody, request: Request): Promise<import("@nestjs/common").UnauthorizedException | import("../dto/return.dto").ReturnDto>;
    refreshToken(request: Request): Promise<object | import("@nestjs/common").UnauthorizedException>;
    validUser(request: Request): Promise<import("../dto/return.dto").ReturnDataDto>;
    getMe(request: Request): Promise<import("../dto/return.dto").ReturnDataDto>;
    logout(response: Response, request: Request): Promise<Response<import("../dto/return.dto").ReturnDto, Record<string, any>>>;
}
