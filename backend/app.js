require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use("/api/user", require("./src/routes/user"));
app.use("/api/categories", require("./src/routes/categories"));
app.use("/api/expenses", require("./src/routes//expenses"));

mongoose
  .connect(process.env.db_uri)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.info(
        "listening to port " + process.env.PORT + " and connected to db atlas"
      );
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });
