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
    
    swaggerDocument.servers = [{
      url: "https://nodejs-hw-mongodb-contacts-i3qb.onrender.com",
    }]
   
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    console.log("Swagger docs available at https://nodejs-hw-mongodb-contacts-i3qb.onrender.com",);
  } catch (err) {
    console.error("Error loading Swagger documentation:", err);
  }
};