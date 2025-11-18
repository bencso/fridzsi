import {
  Body,
  ConflictException,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BodyLogin, LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { BodyRegistration, RegistrationDto } from './dto/registration.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ReturnUserDto } from '../users/dto/return.dto';
import { randomUUID, UUID } from 'crypto';
import { SessionService } from '../sessions/sessions.service';
import { Sessions, UserData } from '../sessions/entities/sessions.entity';
import { User } from '../users/entities/user.entity';
import { ReturnDataDto, ReturnDto } from '../dto/return.dto';
import { DataSource } from 'typeorm';
import { PasswordChangeBody } from './dto/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly sessionsService: SessionService,
    private readonly dataSource: DataSource,
  ) {}

  async login(
    @Body() body: BodyLogin,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<ReturnDataDto> | UnauthorizedException> {
    try {
      const returnData = (await this.signIn(
        body.email,
        body.password,
        request,
      )) as LoginDto;

      if (returnData.refreshToken) {
        response.cookie('refreshToken', returnData.refreshToken, {
          maxAge: Number(this.config.get<string>('JWT_REFRESH_TIME')),
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });

        return response.json({
          ...returnData,
        });
      } else {
        throw new UnauthorizedException({
          message: 'Érvénytelen bejelentkezési adat(ok)',
          status: 401,
        });
      }
    } catch (error) {
      throw new ConflictException({
        message: [error.message],
        statusCode: error.status,
      });
    }
  }

  async passwordChange(
    body: PasswordChangeBody,
    request: Request,
  ): Promise<ReturnDto | UnauthorizedException> {
    const salt = 10;
    try {
      const requestUser =
        await this.sessionsService.validateAccessToken(request);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      const user = await this.usersService.findUser(requestUser.email);

      if (await bcrypt.compare(body.password, user?.password)) {
        throw new Error('Kérjük előző jelszavát ne használja!');
      }

      await this.usersService
        .updatePassword({
          password: hashedPassword,
          userId: user.id,
        })
        .then((value) => {
          if (value.statusCode !== 200)
            return {
              message: [value.message ?? 'Ismeretlen hiba'],
              statusCode: 400,
            };
        })
        .catch((error) => {
          return {
            message: [error ?? 'Ismeretlen hiba'],
            statusCode: 400,
          };
        });

      return {
        message: ['Sikeres jelszóváltoztatás!'],
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        message: [error.message ?? 'Ismeretlen hiba'],
        statusCode: error.status ?? 400,
      };
    }
  }

  async signIn(
    email: string,
    password: string,
    request: Request,
  ): Promise<LoginDto | UnauthorizedException> {
    try {
      const user = (await this.usersService.findUser(email)) as User;
      const compared = await bcrypt.compare(password, user.password);
      if (!compared) {
        throw new UnauthorizedException({
          message: 'Érvénytelen bejelentkezési adat(ok)',
          status: 401,
        });
      } else {
        const payload = {
          sub: user.id,
          tokenId: randomUUID(),
        };

        const user_data = {
          ip: request.ip,
          user_agent: request.headers['user-agent'],
        } as UserData;

        const accessToken = await this.createAccessToken(user, user_data);
        const refreshToken = await this.createRefreshToken(payload);
        await this.sessionsService.createSessionInDb(
          payload.sub,
          refreshToken,
          user_data,
          payload.tokenId,
        );

        return {
          message: ['Sikeres bejelentkezés'],
          statusCode: 200,
          refreshToken: refreshToken,
          accessToken: accessToken,
          username: user.username,
          email: email,
        };
      }
    } catch (err) {
      return {
        message: [err.message],
        statusCode: err.status,
      };
    }
  }

  async registration(
    body: BodyRegistration,
  ): Promise<RegistrationDto | ConflictException> {
    const salt = 10;
    try {
      const hashedPassword = await bcrypt.hash(body.password, salt);
      await this.usersService
        .create({
          email: body.email,
          username: body.username,
          password: hashedPassword,
        })
        .then((value) => {
          if (value.statusCode !== 200)
            if (String(value.message).includes('ER_DUP_ENTRY')) {
              throw new ConflictException(
                'Ez az email cím már regisztrálva van!',
              );
            } else {
              throw new ConflictException(value);
            }
        })
        .catch((error) => {
          throw new ConflictException(error);
        });

      return {
        message: ['Sikeres regisztrációs!'],
        statusCode: 200,
        data: {},
      };
    } catch (err) {
      return {
        message: [err.message],
        statusCode: err.status,
      };
    }
  }

  async refresh(
    request: Request,
    body: { refreshToken: string },
  ): Promise<object | UnauthorizedException> {
    if (request) {
      try {
        if (body.refreshToken) {
          const requestUser =
            await this.sessionsService.validateRefreshTokenUserData(
              body.refreshToken,
            );

          if (typeof requestUser !== 'number') throw new Error();

          const user = await this.usersService.findOne(requestUser);
          const user_data = {
            ip: request.ip,
            user_agent: request.headers['user-agent'],
          } as UserData;

          const accessToken = await this.createAccessToken(user, user_data);

          const payload = {
            sub: user.id,
            tokenId: randomUUID(),
          };

          const refreshToken = await this.createRefreshToken(payload);

          return { accessToken, refreshToken };
        } else throw new Error();
      } catch (error) {
        throw new UnauthorizedException(
          'Érvénytelen vagy lejárt refresh token: ' + error,
        );
      }
    } else
      throw new UnauthorizedException({
        message: 'Érvénytelen bejelentkezési adat(ok)',
        status: 401,
      });
  }

  async createAccessToken(user: ReturnUserDto, user_data: UserData) {
    const payload = {
      email: user.email,
      user_data: user_data,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_TOKEN_SECRET'),
      expiresIn: Number(this.config.get<any>('JWT_TOKEN_TIME')),
    } as JwtSignOptions);
  }

  async createRefreshToken(payload: { sub: number; tokenId: UUID }) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: Number(this.config.get<any>('JWT_REFRESH_TIME')),
    } as JwtSignOptions);
  }

  async logout(
    response: Response,
    request: Request,
  ): Promise<Response<ReturnDto>> {
    try {
      const token = request.headers.authorization.split(' ')[1];
      if (token) {
        let payload;
        try {
          payload = await this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('JWT_TOKEN_SECRET'),
            ignoreExpiration: true,
          });
          //? User DTO itt passwordos mennyire kockázatos lehet?!?
          const user = await this.usersService.findUser(payload.email);
          const clientLogged = await this.dataSource
            .getRepository(Sessions)
            .createQueryBuilder()
            .select()
            .where({
              user: user.id,
              user_data: JSON.stringify(payload.user_data),
            })
            .getCount();

          if (clientLogged > 0)
            await this.dataSource
              .createQueryBuilder()
              .delete()
              .from(Sessions)
              .where({
                user_data: JSON.stringify(payload.user_data),
                user: user.id,
              })
              .execute();
        } catch (error) {
          console.log(error);
        }
      }
      response.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      return response.json({
        message: ['Sikeres kijelentkezés'],
        statusCode: 200,
      });
    } catch {
      throw new UnauthorizedException({
        message: 'Hiba történt kijelentkezés során!',
        status: 401,
      });
    }
  }

  async validation(request: Request): Promise<ReturnDataDto> {
    try {
      const user = await this.sessionsService.validateAccessToken(request);
      if (!user)
        throw new UnauthorizedException('Nem érvényes bejelentkezési token!');
      return {
        message: ['Érvényes felhasználó'],
        statusCode: 200,
        data: {
          user: user,
          valid: !!user,
        },
      };
    } catch {
      return {
        message: ['Nem érvényes felhasználó'],
        statusCode: 401,
        data: {
          valid: false,
        },
      };
    }
  }

  async getMe(request: Request): Promise<ReturnDataDto> {
    try {
      const user = await this.sessionsService.validateAccessToken(request);
      const userDataArr = await this.dataSource
        .getRepository(User)
        .createQueryBuilder()
        .select(['username as username', 'email as email'])
        .where({
          email: user.email,
        })
        .execute();
      const userData = userDataArr[0] as User;

      if (!userData)
        throw new UnauthorizedException('Nem érvényes bejelentkezési token!');
      return {
        message: ['Sikeres lekérdezés!'],
        statusCode: 200,
        data: {
          user: {
            email: userData.email,
            username: userData.username,
          },
        },
      };
    } catch {
      return {
        message: ['Sikertelen lekérdezés!'],
        statusCode: 401,
        data: {
          valid: false,
        },
      };
    }
  }
}
