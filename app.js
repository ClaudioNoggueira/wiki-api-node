const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((request, response) => {
        Article.find((error, queryResult) => {
            if (!error) {
                response.send(queryResult);
            } else {
                response.send("Unable to find articles. Error: " + error);
            }
        });
    })
    .post((request, response) => {
        const newArticle = new Article({
            title: request.body.title,
            content: request.body.content
        });

        newArticle.save((error) => {
            if (!error) {
                response.send("Successfully added a new article.");
            } else {
                response.send(error);
            }
        });
    })
    .delete((request, response) => {
        Article.deleteMany((error) => {
            if (!error) {
                response.send("Successfully deleted all articles.");
            } else {
                response.send(error);
            }
        });
    });

app.route('/articles/:title')
    .get((request, response) => {
        Article.findOne({ title: request.params.title }, (error, queryResult) => {
            if (!error) {
                if (queryResult) {
                    response.send(queryResult);
                } else {
                    response.send("Unable to find article with title: '" + request.params.title);
                }
            } else {
                response.send(error);
            }
        });
    })
    .put((request, response) => {
        Article.updateOne(
            { title: request.params.title },
            {
                title: request.body.title,
                content: request.body.content
            },
            (error) => {
                if (!error) {
                    response.send("Successfully updated article.")
                } else {
                    response.send(error);
                }
            })
    })
    .patch((request, response) => {
        Article.updateOne(
            { title: request.params.title },
            { $set: request.body },
            (error) => {
                if (!error) {
                    response.send("Successfully updated article.")
                } else {
                    response.send(error);
                }
            });
    });

app.listen(3000, () => {
    console.log("✔ Server is running on port 3000");
});