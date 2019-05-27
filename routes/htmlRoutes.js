// const models = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const mongojs = require("mongojs");
const databaseUrl = "newsscraper";
const collections = ["articles","notes"];
const db = mongojs(databaseUrl, collections);
db.on("error", (error) => {
  console.log("Database error: ",error);
});

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    debugger;
    db.Article.find({})
    .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // const retrievedArticles = dbArticle;
        console.log(dbArticle);
        // let hbsObject;
        // hbsObject = {
        //     articles: dbArticle
        // };
        // res.render("index", hbsObject);        
    })
    .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
  });

  app.get("/scrape", function(req, res) {
    console.log("\n***********************************\n" +
    "Grabbing every thread name and link\n" +
    "from WP webdev board:" +
    "\n***********************************\n");
    axios.get("https://www.washingtonpost.com")
    .then((response) => {
        let $ = cheerio.load(response.data);
        // let results = [];
        $("div.headline").each((i, element) => {
          console.log(i);
          // console.log(element);
          let headline = $(element).text();
          // console.log(headline);
          let link = $(element).children("a").attr("href");
          if(link == undefined)  return true;
          
          db.articles.insert({
            src: "washington post",
            headline: headline,
            link: link
          }, (err, inserted) => {
            if(err) {
              console.log("Mongo Insert Error: ",err);
            }
            else {
              console.log("inserted: ",inserted);
            }
          });

      });
    });
    console.log("Scrape Complete");
    res.redirect("/");
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    // db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
    //   res.render("example", {
    //     example: dbExample
    //   });
    // });
  });

  // Render 404 page for any unmatched routes - do not put any routes below this wildcard 
  app.get("*", function(req, res) {
    res.render("404");
  });
};
