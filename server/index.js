require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const { CONNECTION_STRING, SESSION_SECRET } = process.env;

const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const app = express();

app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("db connected");
});

//Auth Endpoints
app.post("api/register", authCtrl.register);
app.post("api/login", authCtrl.login);
app.get("api/logout", authCtrl.logout);

app.get("api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get("api/treasure/all", auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
