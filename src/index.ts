import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import authRoute from "./routes/auth.routes";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads/*", serveStatic({ root: "./public" }));

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Backend Auth service berjalan",
  });
});

app.route("/api/auth", authRoute);

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};