import swaggerJSDoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "A simple API for managing tasks (add, view, delete tasks)",
      contact: {
        name: "API Support",
      },
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://task-management-system-backend-19c4.onrender.com/api"
            : "http://localhost:8000/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server",
      },
    ],

    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["text", "priority"],
          properties: {
            id: {
              type: "string",
              example: "17123456789",
            },
            text: {
              type: "string",
              example: "Fix authentication bug",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
            completed: {
              type: "boolean",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong",
            },
          },
        },

        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
  },

  apis:
    process.env.NODE_ENV === "production"
      ? ["./dist/**/*.js"]
      : ["./src/**/*.ts"],
};

export const specs = swaggerJSDoc(options);

export default specs;
