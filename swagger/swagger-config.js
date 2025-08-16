import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Phonebook API",
      version: "1.0.0",
      description: "API documentation for the Phonebook project",
    },
    servers: [
      {
        url: "https://nodejs-hw-mongodb-contacts-i3qb.onrender.com",
      },
    ],
  },
  apis: ["./swagger/**/*.yaml"], 

};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
