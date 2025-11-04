"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const sessions_entity_1 = require("./entities/sessions.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let SessionService = class SessionService {
    constructor(dataSource, jwtService, config, userService) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.config = config;
        this.userService = userService;
    }
    async createSessionInDb(sub, token, user_data, sessionId) {
        const user = (await this.userService.findOne(sub));
        const isHave = await this.dataSource
            .getRepository(sessions_entity_1.Sessions)
            .createQueryBuilder()
            .select()
            .where({
            user: user,
        })
            .getCount();
        if (isHave > 0) {
            await this.dataSource
                .createQueryBuilder()
                .update(sessions_entity_1.Sessions)
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
        }
        else {
            await this.dataSource
                .createQueryBuilder()
                .insert()
                .into(sessions_entity_1.Sessions)
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
    async deleteSessionInDb(token, user_data) {
        const clientLogged = await this.dataSource
            .getRepository(sessions_entity_1.Sessions)
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
                .from(sessions_entity_1.Sessions)
                .where({
                user_data: JSON.stringify(user_data),
            })
                .execute();
    }
    async validateAccessToken(req) {
        try {
            const authHeader = req.headers.authorization;
            const accessToken = authHeader?.split(' ')[1];
            if (!accessToken)
                return null;
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.config.get('JWT_TOKEN_SECRET'),
            });
            return payload;
        }
        catch {
            return null;
        }
    }
    async validateRefreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const dbData = await this.dataSource
                .getRepository(sessions_entity_1.Sessions)
                .createQueryBuilder('sessions')
                .where('sessions.userId = :userId AND sessions.token = :token', {
                userId: payload.sub,
                token: refreshToken,
            })
                .getOne();
            return !!dbData;
        }
        catch {
            return false;
        }
    }
    async validateRefreshTokenUserData(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const haveUser = await this.dataSource
                .getRepository(sessions_entity_1.Sessions)
                .createQueryBuilder('sessions')
                .where('sessions.userId = :userId', {
                userId: payload.sub,
                session_id: payload.tokenId,
            })
                .getOne();
            if (!haveUser.token)
                throw new Error();
            return payload.sub;
        }
        catch {
            return false;
        }
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], SessionService);
//# sourceMappingURL=sessions.service.js.map