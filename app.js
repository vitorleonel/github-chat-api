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
app.use(express.urlencoded({ extended: false }));

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const user = req.query.user;

  const auth = pusher.authenticate(socketId, channel, {
    user_id: `user-${user}`,
  });

  return res.send(auth);
});

app.post("/:channel", (req, res) => {
  pusher.trigger(req.params.channel, "messages", req.body);

  return res.status(204).json(null);
});

app.listen(process.env.PORT || 4000, () => console.log("Server started."));
