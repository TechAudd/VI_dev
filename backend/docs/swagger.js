const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Auth API",
        description: "User authentication API with JWT",
    },
    host: "localhost:4100",
    schemes: ["http"],
};

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./routes/authRoutes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
