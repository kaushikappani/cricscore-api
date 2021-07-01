const axios = require("axios");
const cherrio = require("cheerio");
const { text } = require("cheerio/lib/api/manipulation");

const html_fetch = async (url) => {
    const response = await axios.get(url)
    return response.data
};

const fetch_recent = async () => {
    let data = []
    const url = "https://www.cricbuzz.com/cricket-match/live-scores/recent-matches"
    const html = await html_fetch(url)
    const $ = cherrio.load(html);
    $(".cb-mtch-lst").each((_, element) => {
        const elem = $(element);
        const title = elem.find("h3").text();
        const date = elem.find("div.text-gray").html()
        const url = "https://www.cricbuzz.com" + elem.find("h3 a").attr("href");
        const scorecard_url = "https://www.cricbuzz.com" + elem.find("nav a[title='Scorecard']").attr("href")
        const meta_text = elem.find("div.text-gray").text()
        const score = elem.find(".cb-lv-scrs-well-complete").text()
        data.push({
            title, meta_text, score, url, scorecard_url, date
        })
    })
    return data

}
const fetch_live = async () => {
    let data = []
    const url = "https://www.cricbuzz.com/cricket-match/live-scores"
    const html = await html_fetch(url)
    const $ = cherrio.load(html);
    $(".cb-mtch-lst").each((_, element) => {
        const elem = $(element);
        const title = elem.find("h3").text();
        const date = elem.find("div.text-gray").html()
        const url = "https://www.cricbuzz.com" + elem.find("h3 a").attr("href");
        const scorecard_url = "https://www.cricbuzz.com" + elem.find("nav a[title='Scorecard']").attr("href")
        const meta_text = elem.find("div.text-gray").text()
        const score = elem.find(".cb-lv-scrs-well-live").text() || elem.find(".cb-lv-scrs-well-complete").text() || elem.find(".cb-lv-scrs-well-preview").text()
        data.push({
            title, meta_text, score, url, scorecard_url, date
        })
    })
    return data
}
const match_data = async (url) => {
    let data = {}
    const html = await html_fetch(url)
    const $ = cherrio.load(html);
    const title = $("h1").text()
    const scores = $(".cb-col-scores").text();
    const recent = $("div.cb-min-rcnt").text();
    const mom = $("div.cb-mom-itm").text();
    const meta = $("div.cb-nav-subhdr").text();
    const summary = $("div.cb-min-stts").text();
    data.summary = summary
    data.title = title
    data.meta = meta
    let commentry = [];
    $("p.cb-com-ln").each((_, elem) => {
        commentry.push($(elem).text());
    })
    data.commentry = commentry;
    data.recent = recent;
    data.mom = mom
    data.scores = scores;
    let records = [];
    $("div.cb-min-inf div.cb-col-100").each((i, element) => {
        const elem = $(element);
        let stats = []
        let name = elem.find("a.cb-text-link").text()
        elem.find("div.text-right").each((_, e) => {
            stats.push($(e).text())
            console.log($(e).text())
        })
        records.push({ name, stats })
        data.records = records
    })
    return data
}
const fetch_schedule = async () => {
    let data = []
    const html = await html_fetch("https://www.cricbuzz.com/cricket-schedule/upcoming-series/international")
    const $ = cherrio.load(html)
    $("div#international-list div.cb-col-67.cb-col").each((_, element) => {
        const elem = $(element);
        const title = elem.find("div div span[itemprop='name']").attr("content")
        const date = elem.find("div div span[itemprop='startDate']").attr("content")
        const time = elem.find("div.cb-mtchs-dy-tm").text()
        const location = elem.find("div[itemprop='location']").text()
        data.push({ title, date, time, location })
    })
    return data
}
const fetch_news = async () => {
    let data = [];
    const html = await html_fetch("https://www.cricbuzz.com/cricket-news/latest-news")
    const $ = cherrio.load(html);
    $("div.cb-nws-lft-col div.cb-pos-rel").each((_, element) => {
        const elem = $(element);
        let path = ""
        if (elem.find("img").attr("src") !== undefined) {
            path = elem.find("img").attr("src").split("205x152")[0] + "500x500" + elem.find("img").attr("src").split("205x152")[1]
        }
        if (elem.find("img").attr("source") !== undefined) {
            path = elem.find("img").attr("source").split("205x152")[0] + "500x500" + elem.find("img").attr("source").split("205x152")[1]
        }
        const image = "https://www.cricbuzz.com" + path
        const title = elem.find("h2").text();
        const intro = elem.find("div.cb-nws-intr").text()
        const time = elem.find("span.cb-nws-time").text()
        data.push({ image, title, intro, time })
    })
    return data
}
module.exports = {
    fetch_recent, fetch_live, match_data, fetch_schedule, fetch_news
}
