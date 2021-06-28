const express = require("express");
const ejs = require("ejs");
var cors = require('cors')
const { fetch_recent, fetch_live, match_data, fetch_schedule, fetch_news } = require("./scrapper");
const app = express();
app.use(express.static('public'))
app.use(cors())
app.set('view engine', 'ejs')
app.get("/", (req, res) => {
    res.send({
        message: "test"
    })
})
app.get('/recent', async (req, res) => {
    const data = await fetch_recent()
    res.send(data)
})
app.get('/live', async (req, res) => {
    const data = await fetch_live()
    res.send(data)
})
app.get("/live/match", async (req, res) => {
    const data = await match_data(req.query.url)
    res.send(data)
})
app.get('/schedule', async (req, res) => {
    const data = await fetch_schedule()
    res.send(data)
})
app.get('/news', async (req, res) => {
    const data = await fetch_news()
    res.send(data)
})
const port = process.env.PORT || 5000
app.listen(port, (req, res) => {
    console.log("server started")
})