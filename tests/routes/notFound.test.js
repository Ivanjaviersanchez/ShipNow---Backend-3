import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("Pruebas funcionales de rutas inexistentes", function () {
  it("debe responder 404 con un error estandarizado", async function () {
    const response = await request(app)
      .get("/ruta-que-no-existe");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error).to.equal("ROUTE_NOT_FOUND");
    expect(response.body.message).to.equal(
      "La ruta solicitada no existe"
    );
  });
});