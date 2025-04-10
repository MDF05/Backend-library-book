import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Book Borrowing API",
    version: "1.0.0",
    description: "API for borrowing books",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./interfaces/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
