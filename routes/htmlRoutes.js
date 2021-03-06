const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");



module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    
    db.Article.find({}, function(error, articles) {

      if(error) {
        console.log(error);
      } else {
        // console.log(articles);
        res.render("index", {
          articles: articles
        });
      } 
    });
 
   });

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
            // return res.json(err);
          });

      });
   
    });
    const timeout = setTimeout(() => {
      console.log("timing out...");
    },10000);
    clearTimeout(timeout);
    console.log("Scrape Complete");
    res.redirect("/");
    // res.send("scrape completed");
  });
  
  app.put(`/save/:id`, (req,res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, {isSaved: true})
    .then((data) => {
      res.json(data);
    })
    .catch( (err) => { 
      res.json(err);
    });
  }); 

  app.put("/remove/:id", (req,res) => {
    db.Article.findOneAndUpdate({_id: req.params.id}, {isSaved: false})
    .then((data) => {
      res.json(data);
    })
    .catch( (err) => { 
      res.json(err);
    });
  }); 

  app.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
             res.render("saved", {articles: retrievedArticles});
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
  });
  
  app.get("/articles/:id", function (req, res) {
    console.log(req.params.id);
    db.Article.find({ _id: req.params.id })
        .populate({
            path: 'text',
            model: 'Note'
        })
        .then(function (dbArticle) {
          console.log(req.params.id);
          res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
  });

  app.post("/note/:id", function (req, res) {
    // Create new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
  });

  app.delete("/note/:id", function (req, res) {
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
        })
        .then(function (dbArticle) {
            // If update success, send Article back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
  // Render 404 page for any unmatched routes - do not put any routes below this wildcard 
  app.get("*", function(req, res) {
    res.render("404");
  });
};
