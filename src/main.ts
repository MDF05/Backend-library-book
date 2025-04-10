import express from "express";
import bookRoutes from "./interfaces/routes/book.route";
import memberRoutes from "./interfaces/routes/member.route";
import borrowRoutes from "./interfaces/routes/borrow.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/borrow", borrowRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
