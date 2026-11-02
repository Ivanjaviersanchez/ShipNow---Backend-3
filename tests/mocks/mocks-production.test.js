
import { expect } from "chai";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

describe("Mocks - Middleware de producción", function () {
  it("debe bloquear el acceso a los mocks con HTTP 403", function () {
    const middlewarePath = path.resolve(
      currentDir,
      "../../src/middleware/mocks.middleware.js"
    );

    // Convierte la ruta de Windows a una URL file:// válida.
    const middlewareUrl = pathToFileURL(middlewarePath).href;

    const script = `
      import { mocksMiddleware } from "${middlewareUrl}";

      const req = {};
      const res = {};

      let receivedError = null;

      mocksMiddleware(req, res, (error) => {
        receivedError = error;
      });

      if (!receivedError) {
        process.exit(1);
      }

      console.log(JSON.stringify({
        statusCode: receivedError.statusCode,
        code: receivedError.code,
        message: receivedError.message
      }));
    `;

    const output = execFileSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          NODE_ENV: "production"
        }
      }
    );

    const jsonLine = output
        .split("\n")
        .find((line) => line.trim().startsWith("{"));

    expect(jsonLine, "El proceso debe devolver un resultado JSON").to.exist;

    const result = JSON.parse(jsonLine.trim());

    expect(result.statusCode).to.equal(403);
    expect(result.code).to.equal("FORBIDDEN");
  });
});
