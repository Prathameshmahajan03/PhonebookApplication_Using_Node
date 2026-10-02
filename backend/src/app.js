const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();

// Parse incoming JSON requests
app.use(express.json());

// CORS configuration for Vue frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use("/api/auth", authRoutes);

// Contact API routes
app.use("/api/contacts", contactRoutes);


// Swagger documentation
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Phonebook Application API",
        version: "1.0.0",
        description: "Phonebook REST API"
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5000}`
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
    paths: {}
};

// Swagger UI endpoint
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.status
            ? err.message
            : "Internal server error"
    });
});

module.exports = app;