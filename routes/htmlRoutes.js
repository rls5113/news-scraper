const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
// const logger = require("morgan");
// const mongoose = require("mongoose");

// const mongojs = require("mongojs");
// const databaseUrl = "newsscraper";
// const collections = ["articles","notes"];
// const db = mongojs(databaseUrl, collections);
// db.on("error", (error) => {
//   console.log("Database error: ",error);
// });
module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    
    db.Article.find({}, function(error, articles) {


      if(error) {
        console.log(error);
      } else {
        console.log(articles);
        res.render("index", {
          articles: articles
        });
      } 
      // res.json(data);
    });
 
   });

  // app.get("/scrape", function(req, res) {
  //   console.log("\n***********************************\n" +
  //   "Grabbing every thread name and link\n" +
  //   "from WP webdev board:" +
  //   "\n***********************************\n");
  //   axios.get("https://www.washingtonpost.com")
  //   .then((response) => {
  //       let $ = cheerio.load(response.data);
  //       // let results = [];
  //       $("div.headline").each((i, element) => {
  //         console.log(i);
  //         // console.log(element);
  //         let headline = $(element).text();
  //         // console.log(headline);
  //         let link = $(element).children("a").attr("href");
  //         if(link == undefined)  return true;
          
  //         db.articles.insert({
  //           src: "washington post",
  //           headline: headline,
  //           link: link
  //         }, (err, inserted) => {
  //           if(err) {
  //             console.log("Mongo Insert Error: ",err);
  //           }
  //           else {
  //             console.log("inserted: ",inserted);
  //           }
  //         });

  //     });
  //   });
  //   console.log("Scrape Complete");
  //   res.redirect("/");
  // });




  app.get("/scrape", function(req, res) {

    axios.get("https://www.washingtonpost.com")
    .then((response) => {
        let $ = cheerio.load(response.data);
        let result = {};
        $("div.headline").each(function(i, element) {
          // console.log(i);
          // console.log(element);
          result.headline = $(this).text();
          // console.log(result.headline);
          result.link = $(this).children("a").attr("href");
          // console.log(result.link);
          result.blurb = $(this).parent().children("div.blurb").text();
          if(result.link == undefined) {
            console.log("skip....");
            return true;
          }
          
          console.log(result);
          db.Article.create(result)
          .then(function(dbArticle) {
            console.log("INSERTED");
            // const timeout = setTimeout(() => {
            //   console.log("timing out...");
            // },100);
            // clearTimeout(timeout);
          })
          .catch(function(err) {
            console.log("ERROR:",err);
          });

      });
   
    });
    // const timeout = setTimeout(() => {
    //   console.log("timing out...");
    // },4000);
    // clearTimeout(timeout);
    console.log("Scrape Complete");
    res.redirect("/");
    // res.send("scrape completed");
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
