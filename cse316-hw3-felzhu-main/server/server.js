// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

//imported models
let answers = require('./models/answers.js')
let questions = require('./models/questions.js')
let tags = require('./models/tags.js')

//requires
const express = require('express');
var cors = require('cors')
var mongoose = require('mongoose');

//constants
const app = express();
const port = 8000;

//connect
var mongoDB = 'mongodb://127.0.0.1/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

//continue
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function () {

    //GET
    app.use(cors());
    app.get('/incrementView/:currentQID', async (req, res) => {
        var id = req.params.currentQID
        await questions.findOneAndUpdate({ _id: id }, { $inc: { 'views': 1 } }).exec()
        res.sendStatus(200)
    })
    app.get('/questions', async (req, res) => {
        let queryQuestions = await questions.find({}, 'title tags asked_by ask_date_time views answers').sort({ ask_date_time: -1 }).populate('tags').exec()
        res.send(queryQuestions)
    })

    app.get('/answer/:QID', async (req, res) => {
        var qid = req.params.QID
        let queryQuestion = await questions.findOne({ _id: qid }).exec()
        let queryAnswers = await answers.find({ _id: { $in: queryQuestion.answers } }).exec()
        res.send({ question: queryQuestion, answer: queryAnswers })
    })

    app.get('/displayTags', async (req, res) => {
        let queryQuestion = await questions.find({}).populate("tags").exec()
        const tagLog = []


        for (let i = 0; i < queryQuestion.length; i++) {
            let tags = queryQuestion[i].tags
            for (let i = 0; i < tags.length; i++) {
                tagLog.push(tags[i].name)
            }
        }

        const count = {}

        tagLog.forEach(e => {
            count[e] = (count[e] || 0) + 1
        })

        res.send(count)
    })

    app.get('/tags', async (req, res) => {
        let querytags = await tags.find({}, 'name').exec()
        res.send(querytags)
    })

    app.get('/views', async (req, res) => {
        let numberOfQuestions = await questions.countDocuments({}).exec()
        res.send('' + numberOfQuestions)
    })

    app.get('/searchQ/:filter', async (req, res) => {
        let input = req.params.filter
        let words = input.split(/[ ]+/)


        let tagList = []
        let questionList = []

        for (let i = 0; i < words.length; i++) {
            if (words[i].charAt(0) == "[" && words[i].charAt(words[i].length - 1) == "]") {
                tagList.push(words[i].substring(1, words[i].length - 1).toLowerCase())
            } else {
                questionList.push(new RegExp(words[i], 'i'))

            }
        }

        let tagPara = await tags.find({ name: { $in: tagList } })

        let questionPara = await questions.find({
            $or: [
                { title: { $in: questionList } },
                { text: { $in: questionList } },
                { tags: { $in: tagPara } },
            ]
        }).populate("tags").exec()

        res.send(questionPara)

    })

    //POST
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post('/addquestion', async (req, res) => {
        let newQuestion = req.body
        const tagList = []
        for (let i = 0; i < newQuestion.tags.length; i++) {
            let tempTag = await getTag(newQuestion.tags[i])
            if ((tempTag === null)) {
                let newTag = await createTag(newQuestion.tags[i])
                tagList.push(newTag)
            } else {
                tagList.push(tempTag)
            }
        }
        const uniqueTagList = [...new Set(tagList)]

        createQuestion(newQuestion.title, newQuestion.text, uniqueTagList, newQuestion.answers, newQuestion.ask_by, newQuestion.ask_date_time, newQuestion.view)
        res.sendStatus(200)
    })


    app.post('/addanswer', async (req, res) => {
        let newAnswer = req.body
        let queryQuestion = await questions.findOne({ _id: newAnswer.qid }).exec()
        let createdAnswer = await createAnswer(newAnswer.text, newAnswer.ans_by)
        await queryQuestion.answers.push(createdAnswer)
        await queryQuestion.save()
        res.sendStatus(200)
    })




})


//end process
process.on('SIGINT', () => {
    if (db) {
        db.close()
            .then((result) => console.log('DB connection closed'))
            .catch((err) => console.log(err));
    }
    console.log('process terminated');
    process.exit()
})

//Listen for Port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//external Functions

function createTag(name) {
    let tag = new tags({ name: name })
    return tag.save()
}

function createAnswer(text, ans_by, ans_date_time) {
    answerInner = { text: text }
    if (ans_by != false) answerInner.ans_by = ans_by
    if (ans_date_time != false) answerInner.ans_date_time = ans_date_time

    let answer = new answers(answerInner)
    return answer.save()
}

function createQuestion(title, text, tags, answers, asked_by, ask_date_time, views) {
    questionInner = {
        title: title,
        text: text,
        tags: tags,
        ask_date_time: ask_date_time
    }
    if (asked_by.replaceAll(" ", "") !== "") questionInner.ask_by = asked_by
    if (views != false) questionInner.views = views
    if (answers != false) questionInner.answers = answers

    let question = new questions(questionInner)
    return question.save()
}

function getTag(name) {
    return tags.findOne({ name: name })
}

