import app from "./src/app.js";
import { config } from "./src/config/index.js";
import { connectDatabase } from "./src/config/database.js";

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(`🚀 ShipNow corriendo en puerto ${config.port}`);
      console.log(`🌎 Entorno: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar ShipNow:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();