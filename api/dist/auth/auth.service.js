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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const login_dto_1 = require("./dto/login.dto");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const sessions_service_1 = require("../sessions/sessions.service");
const sessions_entity_1 = require("../sessions/entities/sessions.entity");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let AuthService = class AuthService {
    constructor(usersService, jwtService, config, sessionsService, dataSource) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
        this.sessionsService = sessionsService;
        this.dataSource = dataSource;
    }
    async login(body, request, response) {
        try {
            const returnData = (await this.signIn(body.email, body.password, request));
            if (returnData.refreshToken) {
                response.cookie('refreshToken', returnData.refreshToken, {
                    maxAge: Number(this.config.get('JWT_REFRESH_TIME')),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                return response.json({
                    ...returnData,
                });
            }
            else {
                throw new common_1.UnauthorizedException({
                    message: 'Érvénytelen bejelentkezési adat(ok)',
                    status: 401,
                });
            }
        }
        catch (error) {
            throw new common_1.ConflictException({
                message: [error.message],
                statusCode: error.status,
            });
        }
    }
    async passwordChange(body, request) {
        const salt = 10;
        try {
            const requestUser = await this.sessionsService.validateAccessToken(request);
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
        }
        catch (error) {
            return {
                message: [error.message ?? 'Ismeretlen hiba'],
                statusCode: error.status ?? 400,
            };
        }
    }
    async signIn(email, password, request) {
        try {
            const user = (await this.usersService.findUser(email));
            const compared = await bcrypt.compare(password, user.password);
            if (!compared) {
                throw new common_1.UnauthorizedException({
                    message: 'Érvénytelen bejelentkezési adat(ok)',
                    status: 401,
                });
            }
            else {
                const payload = {
                    sub: user.id,
                    tokenId: (0, crypto_1.randomUUID)(),
                };
                const user_data = {
                    ip: request.ip,
                    user_agent: request.headers['user-agent'],
                };
                const accessToken = await this.createAccessToken(user, user_data);
                const refreshToken = await this.createRefreshToken(payload);
                await this.sessionsService.createSessionInDb(payload.sub, refreshToken, user_data, payload.tokenId);
                return {
                    message: ['Sikeres bejelentkezés'],
                    statusCode: 200,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    username: user.username,
                    email: email,
                };
            }
        }
        catch (err) {
            return {
                message: [err.message],
                statusCode: err.status,
            };
        }
    }
    async registration(body) {
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
                        throw new common_1.ConflictException('Ez az email cím már regisztrálva van!');
                    }
                    else {
                        throw new common_1.ConflictException(value);
                    }
            })
                .catch((error) => {
                throw new common_1.ConflictException(error);
            });
            return {
                message: ['Sikeres regisztrációs!'],
                statusCode: 200,
                data: {},
            };
        }
        catch (err) {
            return {
                message: [err.message],
                statusCode: err.status,
            };
        }
    }
    async refresh(request, body) {
        if (request) {
            try {
                if (body.refreshToken) {
                    const requestUser = await this.sessionsService.validateRefreshTokenUserData(body.refreshToken);
                    if (typeof requestUser !== 'number')
                        throw new Error();
                    const user = await this.usersService.findOne(requestUser);
                    const user_data = {
                        ip: request.ip,
                        user_agent: request.headers['user-agent'],
                    };
                    const accessToken = await this.createAccessToken(user, user_data);
                    const payload = {
                        sub: user.id,
                        tokenId: (0, crypto_1.randomUUID)(),
                    };
                    const refreshToken = await this.createRefreshToken(payload);
                    return { accessToken, refreshToken };
                }
                else
                    throw new Error();
            }
            catch (error) {
                throw new common_1.UnauthorizedException('Érvénytelen vagy lejárt refresh token: ' + error);
            }
        }
        else
            throw new common_1.UnauthorizedException({
                message: 'Érvénytelen bejelentkezési adat(ok)',
                status: 401,
            });
    }
    async createAccessToken(user, user_data) {
        const payload = {
            email: user.email,
            user_data: user_data,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_TOKEN_SECRET'),
            expiresIn: Number(this.config.get('JWT_TOKEN_TIME')),
        });
    }
    async createRefreshToken(payload) {
        return this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: Number(this.config.get('JWT_REFRESH_TIME')),
        });
    }
    async logout(response, request) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            if (token) {
                let payload;
                try {
                    payload = await this.jwtService.verifyAsync(token, {
                        secret: this.config.get('JWT_TOKEN_SECRET'),
                        ignoreExpiration: true,
                    });
                    const user = await this.usersService.findUser(payload.email);
                    const clientLogged = await this.dataSource
                        .getRepository(sessions_entity_1.Sessions)
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
                            .from(sessions_entity_1.Sessions)
                            .where({
                            user_data: JSON.stringify(payload.user_data),
                            user: user.id,
                        })
                            .execute();
                }
                catch (error) {
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
        }
        catch {
            throw new common_1.UnauthorizedException({
                message: 'Hiba történt kijelentkezés során!',
                status: 401,
            });
        }
    }
    async validation(request) {
        try {
            const user = await this.sessionsService.validateAccessToken(request);
            if (!user)
                throw new common_1.UnauthorizedException('Nem érvényes bejelentkezési token!');
            return {
                message: ['Érvényes felhasználó'],
                statusCode: 200,
                data: {
                    user: user,
                    valid: !!user,
                },
            };
        }
        catch {
            return {
                message: ['Nem érvényes felhasználó'],
                statusCode: 401,
                data: {
                    valid: false,
                },
            };
        }
    }
    async getMe(request) {
        try {
            const user = await this.sessionsService.validateAccessToken(request);
            const userDataArr = await this.dataSource
                .getRepository(user_entity_1.User)
                .createQueryBuilder()
                .select(['username as username', 'email as email'])
                .where({
                email: user.email,
            })
                .execute();
            const userData = userDataArr[0];
            if (!userData)
                throw new common_1.UnauthorizedException('Nem érvényes bejelentkezési token!');
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
        }
        catch {
            return {
                message: ['Sikertelen lekérdezés!'],
                statusCode: 401,
                data: {
                    valid: false,
                },
            };
        }
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.BodyLogin, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        sessions_service_1.SessionService,
        typeorm_1.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map