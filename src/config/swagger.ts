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
          properties: {
            _id: {
              type: "string",
              example: "69ef112538d8568dc18adeec",
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
            tags: {
              type: "array",
              items: { type: "string" },
              example: [],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        TaskCreate: {
          type: "object",
          required: ["text", "priority"],
          properties: {
            text: {
              type: "string",
              example: "Fix authentication bug",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
          },
        },

        TaskUpdate: {
          type: "object",
          properties: {
            text: {
              type: "string",
              example: "Updated task",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            completed: {
              type: "boolean",
              example: true,
            },
          },
        },

        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Task created successfully",
            },
            data: {
              $ref: "#/components/schemas/Task",
            },
          },
        },

        TaskListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Tasks fetched successfully",
            },
            data: {
              type: "object",
              properties: {
                tasks: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
                pagination: {
                  type: "object",
                  properties: {
                    total: { type: "number", example: 10 },
                    page: { type: "number", example: 1 },
                    limit: { type: "number", example: 10 },
                    totalPages: { type: "number", example: 1 },
                  },
                },
              },
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
