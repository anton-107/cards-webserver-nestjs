"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenExtractor = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let BearerTokenExtractor = class BearerTokenExtractor {
    extractTokenFromRequest(request) {
        const [type, scheme, token] = String(request.headers[constants_1.INCOMING_HTTP_HEADER]).split(" ");
        return type === "Bearer" ? `${scheme} ${token}` : undefined;
    }
};
exports.BearerTokenExtractor = BearerTokenExtractor;
exports.BearerTokenExtractor = BearerTokenExtractor = __decorate([
    (0, common_1.Injectable)()
], BearerTokenExtractor);
