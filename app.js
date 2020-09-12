require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");

const app = express();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "us2",
  useTLS: true,
});

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  pusher.trigger(req.body.channel, "messages", req.body.data);

  return res.status(204).json(null);
});

app.listen(process.env.PORT || 4000, () => console.log("Server started."));
