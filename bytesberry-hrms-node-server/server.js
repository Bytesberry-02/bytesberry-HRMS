const express = require("express");
const app = express();
const path = require("path");
const pool = require("./dbConfig");
const cors = require("cors");
const bcrypt = require("bcrypt");

pool.connect();

pool.on("error", (e) => {
  console.error("DB error", e);
});

// Enable CORS for all origins (or you can specify certain origins)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add headers if needed
  })
);

app.use(express.json());

// Serve static files
app.use("/", express.static(path.join(__dirname, "/build")));

//#region Routes

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"), function (err) {
    if (res.status === 404) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    }
    if (res.status === 429) {
      res.sendFile(path.join(__dirname, "views", "429.html"));
    }
    if (err) {
      res.sendFile(path.join(__dirname, "views", "500.html"));
    }
  });
});

const routing_url = ["/", ""];

routing_url.map((url) =>
  app.get(url, function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"), function (err) {
      if (res.status === 404) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
      }
      if (err) {
        res.sendFile(path.join(__dirname, "views", "500.html"));
      }
    });
  })
);

app.use("/systemAdmin", require("./routes/api/systemadmin"));

//#endregion

//#region Public Routes

// const hashedPassword = bcrypt.hashSync("demo@123", bcrypt.genSaltSync());

// console.log("hashedPassword", hashedPassword);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is running on port:", port);
});
