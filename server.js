const express = require("express");
const path = require("path");
const http = require("http");
var cors = require("cors");
const cookieParse = require("cookie-parser");
let bodyParser = require("body-parser");

const { setupSocketAPI } = require('./services/socket.service')

const app = express();
const server = http.createServer(app);

const router = express.Router();
app.use(cors());
app.set("trust proxy", true);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cookieParse());

if (!process.env.PRODUCTION) {
  const dotenv = require("dotenv");
  const result = dotenv.config();
  
  if (result.error) {
    throw result.error;
  }
}

// ------------------------------------------------ //

//set static folder
app.use(express.static(path.join(__dirname, "Public")));
app.use("/api", router);

// -----------APIs:----------------------
// Import other necessary modules
const authRouter = require("./api/auth"); // Import the auth router
const negotiationRouter = require("./api/negotiation"); // Import the negotiation router
const notificationRouter = require("./api/notification"); // Import the notification router
const emailRouter = require("./api/email"); // Import the email router
const mediatorRouter = require("./api/mediator"); // Import the mediators router
const expertiseRouter = require("./api/expertise"); // Import the mediators router


// Use the auth router for the /api/auth route
app.use("/api/auth", authRouter);
app.use("/api/negotiation", negotiationRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/email", emailRouter);
app.use("/api/mediator", mediatorRouter);
app.use("/api/expertise", expertiseRouter);


// +++++++++++++++Sockets+++++++++++++++
setupSocketAPI(server)

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, link: http://localhost:${PORT}`);
});
