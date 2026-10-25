
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("Pruebas funcionales del logger", function () {
  describe("GET /api/loggerTest", function () {
    it("debe responder 200 y confirmar la ejecución de los niveles del logger", async function () {
      const response = await request(app)
        .get("/api/loggerTest");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.message).to.equal(
        "Logger test ejecutado correctamente"
      );

      expect(response.body.levels).to.deep.equal([
        "debug",
        "http",
        "info",
        "warning",
        "error",
        "fatal"
      ]);
    });
  });
});