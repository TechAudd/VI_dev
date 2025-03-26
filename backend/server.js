require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./models");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

// ✅ CORS Configuration
const corsOptions = {
    origin: "http://localhost:5174", // Frontend URL
    credentials: true, // Allows cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/form", formRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is Running");
});

app.listen(PORT, async () => {
    await initDB();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
