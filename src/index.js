const { app } = require("./app");
const dotenv = require("dotenv");
const requireDir = require("require-dir");
const { Router } = require("express");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

dotenv.config();

// MongoDB connection
require("./config/mongoDb");

// Load all controllers
requireDir("controllers", { recurse: true });

const router = Router();
const port = process.env.PORT || 5000;


app.use("/api/v1", router);


router.use("/auth", authRoutes);
router.use("/item", itemRoutes);


require("./lib/swagger")(app);

app.listen(port, () => {
  console.log(
    `🚀 Server is running on port ${port} | Environment: ${process.env.ENVIRONMENT}`
  );
  console.log(`📘 Swagger Docs available at: http://localhost:${port}/api-docs`);
});
