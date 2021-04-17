const express = require("express");
const colors = require("colors");
const path = require("path");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const app = express();
app.use(morgan("dev"));

// Body Parse
app.use(express.json());
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));
app.use("/api/v1/covid19", require("./routes/covid19"));
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on ${PORT}`.green.bold));
