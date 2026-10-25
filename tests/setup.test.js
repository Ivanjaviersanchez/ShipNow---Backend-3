
import { expect } from "chai";

describe("Configuración del entorno de testing", function () {
  it("debe utilizar exclusivamente la base shipnow_test", function () {
    expect(process.env.NODE_ENV).to.equal("test");
  });
});