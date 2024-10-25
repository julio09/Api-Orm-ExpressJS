const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:5173"
};


app.use(
    cors({
        corsOptions,
        credentials:true,
        origin: true
    }),
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models/db");

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to API application." });
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-credentials", "true");
    res.setHeader("access-control-allow-headers", "content-type");
    res.setHeader(
        "access-control-allow-methods",
        "GET, POST, PUT, DELETE, PATCH, OPTION")
});


require("./routes/tuto.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});