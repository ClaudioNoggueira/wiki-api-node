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
    Article.find((err, queryResult) => {
        if (!err) {
            response.send(queryResult);
        } else {
            response.send("Unable to find articles. Error: " + err);
        }
    });
})

app.post('/articles', (request, response) => {
    const newArticle = new Article({
        title: request.body.title,
        content: request.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            response.send("Successfully added a new article.");
        } else {
            response.send(err);
        }
    });
});

app.listen(3000, () => {
    console.log("✔ Server is running on port 3000");
});