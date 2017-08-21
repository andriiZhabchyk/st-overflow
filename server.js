const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dBase = require('./data/db');
const cors = require('cors');
const app = express();

let jsonParser = bodyParser.json();
let db;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("views engine", "hbs");

/*get all questions*/
app.get('/api/questions', (req, res) => {
    db.collection('questions').find().sort({date: -1}).toArray((err, items) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.send(items);
    });
});

/*get answered questions*/
app.get('/api/questions/answered', (req, res) => {
    const status = req.params.status;
    db.collection('questions').find({hasAnswer: true}).sort({date: -1}).toArray((err, items) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.send(items);
    });
});

/*get unanswered questions*/
app.get('/api/questions/unanswered', (req, res) => {
    const status = req.params.status;
    db.collection('questions').find({hasAnswer: false}).sort({date: -1}).toArray((err, items) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.send(items);
    });
});

/*get item question*/
app.get('/api/questions/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    db.collection('questions').findOne({_id: id}, (err, item) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.render('question.hbs', item);
    });
});

/*post new question*/
app.post('/api/questions/', (req, res) => {
    const user = req.body.user,
        date = req.body.date,
        title = req.body.title,
        description = req.body.description,
        hasAnswer = req.body.hasAnswer;
    let answers = req.body.answers;

    if (hasAnswer === false){
        answers = [];
    }

    const item = {
        user: user,
        date: date,
        title: title,
        description: description,
        hasAnswer: hasAnswer,
        answers: answers
    };

    db.collection('questions').insertOne(item, (err, result) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.send(item);
    });
});

/*update item question info*/
app.post('/api/questions/:id', jsonParser, (req, res) => {
    const id = ObjectID(req.params.id);
    const ansID = req.body.ansID,
        ansUser = req.body.ansUser,
        ansDescription = req.body.ansDescription;

    let answer = {
        ansID: ansID,
        ansUser: ansUser,
        ansDescription: ansDescription
    };

    db.collection('questions').updateOne({_id: id}, {$set: {hasAnswer: true}});
    db.collection('questions').findOneAndUpdate({_id: id}, {$push: {answers: answer}}, (err, item) => {
        if (err) {
            console.log(err);
            return res.send('Error');
        }
        res.send(answer);
    });
});

/*start server & mongo client*/
MongoClient.connect(dBase.url, (err, database) => {
    if (err) {
        return console.log(err);
    }

    db = database;

    app.listen(8080, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('Start server in port 8080');
    });
});

