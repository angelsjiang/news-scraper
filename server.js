var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;

var app = express();

// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

// mongoose connection setup
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Routes

app.get("/scrape", function(req, res) {
    axios.get("https://www.bbc.com/news").then(function(response) {
        var $ = cheerio.load(response.data);

        $(".gel-layout__item.nw-c-top-stories__secondary-item").each(function(i ,element) {
            var result = {};

            result.title = $(this).find("a").text();
            result.link = $(this).find("a").attr("href");
            result.summary = $(this).find("p").text();
            result.time = $(this).find("time").data("datetime");

            console.log(result);

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        res.send("Scrape Complete");
    });
});


// articles 
app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(result) {
        res.json(result);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.delete("/articles/clear", function(req, res) {
    db.Article.remove().then(function(result) {
        res.json(result);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/saved", function(req, res) {
    db.Article.find({saved: true}).then(function(result) {
        res.json(result);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true }} )
        .then(function(result) {
            res.json(result);
        });
});

// comments
app.get("/articles/comment/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
        .populate("comment")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/comment/:id", function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});


// listening
app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port " + PORT + "!");
});