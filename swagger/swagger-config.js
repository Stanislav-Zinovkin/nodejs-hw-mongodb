import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

export const swaggerDocs = (app) => {
 
  const swaggerFilePath = path.join(process.cwd(), "swagger", "openapi.yaml");

  
  const yaml = fs.readFileSync(swaggerFilePath, "utf8");
  const swaggerDocument = require("js-yaml").load(yaml);

 
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  console.log("Swagger docs available at http://localhost:3000/api-docs");
};