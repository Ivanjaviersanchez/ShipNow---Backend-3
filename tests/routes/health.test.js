
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import { config } from "../../src/config/index.js";

describe("Health check", () => {
  describe("GET /health", () => {
    it("debe responder 200 y devolver el estado completo de la API", async () => {
      const response = await request(app).get("/health");

      expect(response.status).to.equal(200);

      expect(response.body).to.have.property("status", "OK");
      expect(response.body).to.have.property(
        "environment",
        config.nodeEnv
      );

      expect(response.body).to.have.property("uptime");
      expect(response.body.uptime).to.be.a("number");
      expect(response.body.uptime).to.be.at.least(0);

      expect(response.body).to.have.property("timestamp");
      expect(response.body.timestamp).to.be.a("string");
      expect(new Date(response.body.timestamp).toISOString())
        .to.equal(response.body.timestamp);
    });
  });
});
