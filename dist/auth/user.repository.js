"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
class InMemoryUserRepository {
    constructor() {
        this.users = [];
    }
    async getUserByName(username) {
        return this.users.find((u) => u.username === username) || null;
    }
    async addUser(user) {
        this.users.push(user);
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
