import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

export const swaggerDocs = (app) => {
  try {
    
    const swaggerFilePath = path.join(process.cwd(), "docs", "swagger.json");

   
    if (!fs.existsSync(swaggerFilePath)) {
      console.error(`Swagger file not found at ${swaggerFilePath}`);
      return;
    }

    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

   
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    console.log("Swagger docs available at http://localhost:4000/api-docs");
  } catch (err) {
    console.error("Error loading Swagger documentation:", err);
  }
};