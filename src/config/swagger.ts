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
        email: "support@taskmanager.com",
      },
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-domain.com"
            : "http://localhost:5000",
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
          required: ["text"],
          properties: {
            id: {
              type: "string",
              example: "17123456789",
            },
            text: {
              type: "string",
              example: "Complete assignment",
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

  apis: ["./src/**/*.ts"],
};

export const specs = swaggerJSDoc(options);

export default specs;
