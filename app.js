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


app.listen(3000, () => {
    console.log("✔ Server is running on port 3000");
});