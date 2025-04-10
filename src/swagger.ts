const swaggerSpec = {
  swagger: "2.0",
  info: {
    title: "Library API",
    version: "1.0.0",
    description: "API for managing library books and members",
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Masukkan token dengan format: Bearer <token>",
    },
  },
  paths: {
    "/api/books": {
      get: {
        summary: "Get all books",
        responses: {
          200: {
            description: "List of books",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  title: { type: "string" },
                  author: { type: "string" },
                  stock: { type: "integer" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add a new book",
        parameters: [
          {
            in: "body",
            name: "book",
            required: true,
            schema: {
              type: "object",
              properties: {
                code: { type: "string" },
                title: { type: "string" },
                author: { type: "string" },
                stock: { type: "integer" },
              },
              required: ["code", "title", "author", "stock"],
            },
          },
        ],
        responses: {
          201: { description: "Book created" },
        },
      },
    },
    "/api/books/{code}": {
      get: {
        summary: "Get book by code",
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: { description: "Book found" },
          404: { description: "Book not found" },
        },
      },
      put: {
        summary: "Update a book",
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "book",
            required: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                author: { type: "string" },
                stock: { type: "integer" },
              },
            },
          },
        ],
        responses: {
          200: { description: "Book updated" },
        },
      },
      delete: {
        summary: "Delete a book",
        parameters: [
          {
            name: "code",
            in: "path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: { description: "Book deleted" },
        },
      },
    },
    "/api/members": {
      get: {
        summary: "Get all members",
        responses: {
          200: {
            description: "List of members",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  borrowedBooks: { type: "integer" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Register a new member",
        parameters: [
          {
            in: "body",
            name: "member",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
              },
              required: ["id", "name"],
            },
          },
        ],
        responses: {
          201: { description: "Member created" },
        },
      },
    },
    "/api/members/{id}/borrow": {
      post: {
        summary: "Borrow a book",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "borrow",
            required: true,
            schema: {
              type: "object",
              properties: {
                bookCode: { type: "string" },
              },
              required: ["bookCode"],
            },
          },
        ],
        responses: {
          200: { description: "Book borrowed successfully" },
          400: { description: "Cannot borrow book" },
        },
      },
    },
    "/api/members/{id}/return": {
      post: {
        summary: "Return a book",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "return",
            required: true,
            schema: {
              type: "object",
              properties: {
                bookCode: { type: "string" },
              },
              required: ["bookCode"],
            },
          },
        ],
        responses: {
          200: { description: "Book returned successfully" },
          400: { description: "Cannot return book" },
        },
      },
    },
  },
};

export default swaggerSpec;
