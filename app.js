const express = require("express");
const ejs = require("ejs");
var cors = require("cors");
const rssToJson = require("rss-in-json");
const {fetch_recent,fetch_live,match_data,fetch_schedule,fetch_news,fetch_article,fetch_news_pagination,
} = require("./scrapper");
const app = express();
app.use(express.static("public"));
var corsOptions = {
  origin: "https://cricketscores.netlify.app",
  optionsSuccessStatus: 200,
};
app.use(cors());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.send({
    message: "test",
  });
});
app.get("/recent", async (req, res) => {
  console.log(req.headers.host);
  const data = await fetch_recent();
  res.send(data);
});
app.get("/live", async (req, res) => {
  const data = await fetch_live();
  res.send(data);
});
app.get("/live/match", async (req, res) => {
  const data = await match_data(`https://www.cricbuzz.com/${req.query.url}`);
  res.send(data);
});
app.get("/schedule", async (req, res) => {
  const data = await fetch_schedule(req.query.url);
  res.send(data);
});
app.get("/news", async (req, res) => {
  const data = await fetch_news();
  res.send(data);
});
app.get("/article", async (req, res) => {
  const data = await fetch_article(`https://www.cricbuzz.com/${req.query.url}`);
  res.send(data);
});
app.get("/news/pagination", async (req, res) => {
  const data = await fetch_news_pagination(req.query.url);
  res.send(data);
});

app.get("*", (req, res) => {
  res.send({ error: "wrong url" });
});
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("server started");
});
