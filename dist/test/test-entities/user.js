"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const supertest_1 = __importDefault(require("supertest"));
class User {
    constructor(login, password) {
        this.login = login;
        this.password = password;
        this.bearerToken = null;
    }
    get authorizationHeader() {
        if (!this.bearerToken) {
            throw Error(`User ${this.login} has not signed in`);
        }
        return `Bearer ${this.bearerToken}`;
    }
    async signIn(appServer) {
        const response = await (0, supertest_1.default)(appServer)
            .post("/auth/signin")
            .send({ login: this.login, password: this.password })
            .expect(200);
        expect(response.body.bearerToken).toMatch(/^jwt\s([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/);
        this.bearerToken = response.body.bearerToken;
    }
}
exports.User = User;
