import { INestApplication } from "@nestjs/common";
import * as fs from "fs";

import { buildNestApp, buildSwaggerDocument } from "./bootstrap";

describe("Main application", () => {
  let app: INestApplication | null = null;

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
  it("should write Swagger API JSON definitions to disk", async () => {
    app = await buildNestApp();
    const swaggerDocument = buildSwaggerDocument(app);

    // Save the generated document as a JSON file
    fs.writeFileSync(
      `${__dirname}/../dist/swagger-spec.json`,
      JSON.stringify(swaggerDocument, null, 2),
    );
  });
});
