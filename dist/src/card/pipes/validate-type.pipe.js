"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ValidateTypePipe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTypePipe = void 0;
const common_1 = require("@nestjs/common");
let ValidateTypePipe = ValidateTypePipe_1 = class ValidateTypePipe {
    constructor() {
        this.logger = new common_1.Logger(ValidateTypePipe_1.name);
        this.parameterName = "Type";
    }
    transform(value) {
        const isValid = /^[a-zA-Z-]+$/.test(value) &&
            !value.startsWith("-") &&
            !value.endsWith("-");
        if (!isValid) {
            this.logger.warn(`Bad request: ${this.parameterName}=${value} (value length: ${value.length})`);
            throw new common_1.BadRequestException(`${this.parameterName} parameter must include only letters and dashes and must not start/end with a dash`);
        }
        return value;
    }
};
exports.ValidateTypePipe = ValidateTypePipe;
exports.ValidateTypePipe = ValidateTypePipe = ValidateTypePipe_1 = __decorate([
    (0, common_1.Injectable)()
], ValidateTypePipe);
