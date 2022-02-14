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

app.get('/articles', (request, response) => {
    Article.find((error, queryResult) => {
        if (!error) {
            response.send(queryResult);
        } else {
            response.send("Unable to find articles. Error: " + error);
        }
    });
})

app.post('/articles', (request, response) => {
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
});

app.delete('/articles', (request, response) => {
    Article.deleteMany((error) => {
        if (!error) {
            response.send("Successfully deleted all articles.");
        } else {
            response.send(error);
        }
    });
});

app.listen(3000, () => {
    console.log("✔ Server is running on port 3000");
});