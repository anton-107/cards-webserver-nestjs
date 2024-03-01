"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSpace = void 0;
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("../../src/auth/constants");
class TestSpace {
    constructor(spaceID, owner) {
        this.spaceID = spaceID;
        this.owner = owner;
    }
    async create(appServer) {
        return (0, supertest_1.default)(appServer)
            .post("/space")
            .send({ spaceID: this.spaceID })
            .set(constants_1.AUTHORIZATION_HEADER, this.owner.authorizationHeader)
            .expect(201)
            .expect({
            spaceID: this.spaceID,
            sortKey: "SPACE",
            owner: this.owner.login,
        });
    }
}
exports.TestSpace = TestSpace;
