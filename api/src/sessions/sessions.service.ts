import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Sessions, UserData } from './entities/sessions.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UsersService,
  ) {}
  async createSessionInDb(
    sub: number,
    token: string,
    user_data: UserData,
    sessionId: string,
  ) {
    const user = (await this.userService.findOne(sub)) as User;
    const isHave = await this.dataSource
      .getRepository(Sessions)
      .createQueryBuilder()
      .select()
      .where({
        user: user,
      })
      .getCount();

    if (isHave > 0) {
      await this.dataSource
        .createQueryBuilder()
        .update(Sessions)
        .set({
          token: token,
          session_id: sessionId,
          user_data: JSON.stringify({
            ip: user_data.ip,
            user_agent: user_data.user_agent,
          }),
        })
        .where({
          user: user,
        })
        .execute();
    } else {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Sessions)
        .values([
          {
            token: token,
            user_data: JSON.stringify({
              ip: user_data.ip,
              user_agent: user_data.user_agent,
            }),
            session_id: sessionId,
            user: user,
          },
        ])
        .execute();
    }
  }

  async deleteSessionInDb(token: string, user_data: UserData) {
    const clientLogged = await this.dataSource
      .getRepository(Sessions)
      .createQueryBuilder()
      .select()
      .where({
        user_data: JSON.stringify(user_data),
        token: token,
      })
      .getCount();

    if (clientLogged > 0)
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Sessions)
        .where({
          user_data: JSON.stringify(user_data),
        })
        .execute();
  }

  async validateAccessToken(req: Request): Promise<any> {
    try {
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.split(' ')[1];

      if (!accessToken) return null;

      //? IGNORE EXPIRATION !!!
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('JWT_TOKEN_SECRET'),
      });

      return payload;
    } catch {
      return null;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const dbData = await this.dataSource
        .getRepository(Sessions)
        .createQueryBuilder('sessions')
        .where('sessions.userId = :userId AND sessions.token = :token', {
          userId: payload.sub,
          token: refreshToken,
        })
        .getOne();

      return !!dbData;
    } catch {
      return false;
    }
  }
}
