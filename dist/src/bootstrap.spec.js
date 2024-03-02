"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("./bootstrap");
const fs = __importStar(require("fs"));
describe("Main application", () => {
    let app = null;
    afterAll(async () => {
        if (app) {
            await app.close();
            console.log("nest.js app closed");
        }
    });
    it("should write Swagger API JSON definitions to disk", async () => {
        app = await (0, bootstrap_1.buildNestApp)();
        const swaggerDocument = (0, bootstrap_1.buildSwaggerDocument)(app);
        // Save the generated document as a JSON file
        fs.writeFileSync(`${__dirname}/../dist/swagger-spec.json`, JSON.stringify(swaggerDocument, null, 2));
    });
});
