// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

//imported models
let answers = require('./models/answers.js')
let questions = require('./models/questions.js')
let tags = require('./models/tags.js')
let users = require('./models/users.js')
let comments = require('./models/comments.js')


//requires
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
var cors = require('cors')
var mongoose = require('mongoose');

//constants
const app = express();
const port = 8000;

//connect
var mongoDB = 'mongodb://127.0.0.1/fake_so';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((res) => {
        console.log("MongoDB Connected")
    })

const store = new MongoStore({
    uri: mongoDB,
    collection: "sessions"
})

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function () {
    app.use(
        session({
            secret: "some secret",
            resave: false,
            saveUninitialized: false,
            store: store,
        })
    )

    // app.use(cookieParser())
    // app.use(bodyParser.urlencoded({extended:true}))

    //GET
    app.use(cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }));

    app.get('/e/:email', async (req, res) => {
        var email = req.params.email
        let queryEmail = await users.findOne({ email: email }).exec()
        res.send(queryEmail)
    })

    app.get('/incrementView/:currentQID', async (req, res) => {
        var id = req.params.currentQID
        await questions.findOneAndUpdate({ _id: id }, { $inc: { 'views': 1 } }).exec()
        res.sendStatus(200)
    })
    app.get('/questions', async (req, res) => {
        let queryQuestions = await questions.find({}, 'title summary tags asked_by ask_date_time views answers upvote downvote').sort({ ask_date_time: -1 }).populate('tags').populate('asked_by', 'username').exec()
        res.send(queryQuestions)
    })
    app.get('/answer/:QID', async (req, res) => {
        var qid = req.params.QID
        let queryQuestion = await questions.findOne({ _id: qid }).populate('asked_by').populate('tags').populate('comment').exec()
        let queryAnswers = await answers.find({ _id: { $in: queryQuestion.answers } }).sort({ ans_date_time: -1 }).populate('ans_by').populate('comment').exec()

        let qcomment = []
        for (let i = 0; i < queryQuestion.comment.length; i++) {
            let queryC = await comments.findOne({ _id: queryQuestion.comment[i]._id }).populate('comment_by').exec()
            qcomment.push(queryC)
        }
        queryQuestion.comment = qcomment


        for (let i = 0; i < queryAnswers.length; i++) {
            let acomment = []
            for (let j = 0; j < queryAnswers[i].comment.length; j++) {
                let queryC = await comments.findOne({ _id: queryAnswers[i].comment[j]._id }).populate('comment_by').exec()
                acomment.push(queryC)
            }
            queryAnswers[i].comment = acomment
        }

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

    app.get('/profiledisplayTags/:userID', async (req, res) => {
        let queryTag = await tags.find({ tag_by: req.params.userID }).exec()
        const tag = []

        for (let i = 0; i < queryTag.length; i++) {
            tag.push(queryTag[i].name)
        }

        let queryQuestion = await questions.find({}).populate("tags").exec()
        const tagLog = []

        for (let i = 0; i < queryQuestion.length; i++) {
            let tags = queryQuestion[i].tags
            for (let i = 0; i < tags.length; i++) {
                if (tag.includes(tags[i].name)) {
                    tagLog.push(tags[i].name)
                }
            }
        }

        const count = {}

        tagLog.forEach(e => {
            count[e] = (count[e] || 0) + 1
        })

        res.send(count)
    })

    app.get('/views', async (req, res) => {
        let numberOfQuestions = await questions.countDocuments({}).exec()
        res.send('' + numberOfQuestions)
    })

    app.get('/user/:userID', async (req, res) => {
        let queryUser = await users.find({ _id: req.params.userID }, 'username').exec()
        res.send(queryUser[0].username)
    })

    app.get('/rep/:userID', async (req, res) => {
        let queryUser = await users.findOne({ _id: req.params.userID }).exec()
        res.send(queryUser.reputation + "")
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
                { summary: { $in: questionList } },
                { tags: { $in: tagPara } },
            ]
        }).populate("tags").exec()

        res.send(questionPara)

    })


    app.get('/login/:current', async (req, res) => {
        req.session.currentPage = req.params.current
        res.send(req.session.userID)
        // if(req.session.userID){
        //     res.send(true)
        // }else{
        //     res.send(false)
        // }
    })

    app.get('/check', async (req, res) => {
        if (req.session) {
            res.send({
                userID: req.session.userID,
                current: req.session.currentPage
            })
        } else {
            res.send({
                login: false
            })
        }
    })


    app.get('/test', async (req, res) => {
        let queryUser = await answers.find({ upvote: [] }).exec()
        res.send(queryUser)
    })

    app.get('/vote/:qid/:userID/:isQuestion', async (req, res) => {
        if (req.params.isQuestion === "true") {
            let queryQU = await questions.find({ _id: req.params.qid, upvote: req.params.userID }).exec() //user found in upvote
            let queryQD = await questions.find({ _id: req.params.qid, downvote: req.params.userID }).exec() //user found in downvote

            let inUpvote = await queryQU.length
            let inDownvote = await queryQD.length
            res.send({ upvote: inUpvote != 0 ? true : false, downvote: inDownvote != 0 ? true : false })
        } else {
            let queryAU = await answers.find({ _id: req.params.qid, upvote: req.params.userID }).exec()
            let queryAD = await answers.find({ _id: req.params.qid, downvote: req.params.userID }).exec()

            let inUpvote = await queryAU.length
            let inDownvote = await queryAD.length
            res.send({ upvote: inUpvote != 0 ? true : false, downvote: inDownvote != 0 ? true : false })
        }

    })

    app.get('/upvote/:qid/:isQuestion/:userID', async (req, res) => {
        let queryUser = await users.findOne({ _id: req.params.userID }).exec()
        if (req.params.isQuestion === "true") {
            let queryQU = await questions.find({ _id: req.params.qid, upvote: req.params.userID }).exec() //user found in upvote
            if (queryQU.length == 0) {
                let question = await questions.findOneAndUpdate({ _id: req.params.qid }, { $push: { upvote: queryUser } }).populate("asked_by").exec()
                let userId = question.asked_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': 5 } }).exec()
                res.send("question on")
            } else {
                let question = await questions.findOneAndUpdate({ _id: req.params.qid }, { $pull: { upvote: { $in: [queryUser] } } }).populate("asked_by").exec()
                let userId = question.asked_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': -5 } }).exec()
                res.send("question off")
            }
        } else {
            let queryAU = await answers.find({ _id: req.params.qid, upvote: req.params.userID }).exec()
            if (queryAU.length == 0) {
                let answer = await answers.findOneAndUpdate({ _id: req.params.qid }, { $push: { upvote: queryUser } }).populate("ans_by").exec()
                let userId = answer.ans_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': 5 } }).exec()
                res.send("answer on")
            } else {
                let answer = await answers.findOneAndUpdate({ _id: req.params.qid }, { $pull: { upvote: { $in: [queryUser] } } }).populate("ans_by").exec()
                let userId = answer.ans_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': -5 } }).exec()
                res.send("answer off")
            }
        }
    })


    app.get('/downvote/:qid/:isQuestion/:userID', async (req, res) => {
        let queryUser = await users.findOne({ _id: req.params.userID }).exec()
        if (req.params.isQuestion === "true") {
            let queryQU = await questions.find({ _id: req.params.qid, downvote: req.params.userID }).exec() //user found in upvote
            if (queryQU.length == 0) {
                let question = await questions.findOneAndUpdate({ _id: req.params.qid }, { $push: { downvote: queryUser } }).populate("asked_by").exec()
                let userId = question.asked_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': -10 } }).exec()
                res.send("question on")
            } else {
                let question = await questions.findOneAndUpdate({ _id: req.params.qid }, { $pull: { downvote: { $in: [queryUser] } } }).populate("asked_by").exec()
                let userId = question.asked_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': 10 } }).exec()
                res.send("question off")
            }
        } else {
            let queryAU = await answers.find({ _id: req.params.qid, downvote: req.params.userID }).exec()
            if (queryAU.length == 0) {
                let answer = await answers.findOneAndUpdate({ _id: req.params.qid }, { $push: { downvote: queryUser } }).populate("ans_by").exec()
                let userId = answer.ans_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': -10 } }).exec()
                res.send("answer on")
            } else {
                let answer = await answers.findOneAndUpdate({ _id: req.params.qid }, { $pull: { downvote: { $in: [queryUser] } } }).populate("ans_by").exec()
                let userId = answer.ans_by._id
                await users.findOneAndUpdate({ _id: userId }, { $inc: { 'reputation': 10 } }).exec()
                res.send("answer off")
            }
        }
    })

    app.get('/userprofile/:userID', async (req, res) => {
        let userID = req.params.userID

        let queryUser = await users.findOne({ _id: userID }).exec()

        let regDate = queryUser.register_date
        let rep = queryUser.reputation
        let questionAsked = await questions.find({ asked_by: userID }).sort({ ask_date_time: -1 }).populate('tags').populate('asked_by', 'username').exec()
        let answerAnsed = await answers.find({ asked_by: userID }).populate('ans_by').populate('comment').exec()
        let tagMade = await tags.find({ tag_by: userID }).exec()

        res.send({
            questions: questionAsked,
            answers: answerAnsed,
            tags: tagMade,
            reputation: rep,
            since: regDate
        })
    })

    app.get('/profileanswer/:userID', async (req, res) => {
        var user = req.params.userID
        let queryAnswers = await answers.find({ ans_by: user }).populate('ans_by').populate('comment').exec()
        res.send({ answer: queryAnswers })
    })

    app.get('/question/:QID', async (req, res) => {
        let queryQ = await questions.findOne({ _id: req.params.QID }).populate('tags').exec()
        res.send(queryQ)
    })

    app.get('/answers/:AID', async (req, res) => {
        let queryA = await answers.findOne({ _id: req.params.AID }).exec()
        res.send(queryA)
    })

    app.get('/tag/:TID', async (req, res) => {
        let queryT = await tags.findOne({ name: req.params.TID }).exec()
        res.send(queryT)
    })

    app.get('/comment/:CID', async (req, res) => {
        let queryC = await comments.findOne({ _id: req.params.CID }).populate('comment_by').exec()
        res.send(queryC)
    })


    //let queryQuestions = await questions.find({}, 'title summary tags asked_by ask_date_time views answers upvote downvote').sort({ ask_date_time: -1 }).populate('tags').populate('asked_by', 'username').exec()

    //POST
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post('/login', async (req, res) => {
        let login = req.body
        let email = login.email
        let password = login.password

        const errorMess = []
        let queryEmail = await users.findOne({ email: email }).exec()
        if (password.length === 0) {
            errorMess.push('Password cannot be empty!')
        }
        if (email.length === 0) {
            errorMess.push('Email cannot be empty!')
        }
        if (!queryEmail) {
            errorMess.push('Email is not in the database!')
            res.send({ userID: "", errorMess: errorMess })
        } else {
            if (queryEmail) {
                bcrypt.compare(password, queryEmail.password, (error, response) => {
                    if (response) {
                        req.session.userID = queryEmail._id
                        res.send({ userID: req.session.userID, errorMess: errorMess })
                    } else {
                        errorMess.push('Wrong email/password combination!')
                        res.send({ userID: "", errorMess: errorMess })
                    }
                })
            }
        }

    })
    app.post('/addcomment', async (req, res) => {

        let queryUser = await users.findOne({ _id: req.body.comment_by }).exec()
        let newComment = await createComment(req.body.text, queryUser)

        let query = (req.body.question ? await questions.findOne({ _id: req.body.addTo }).exec() : await answers.findOne({ _id: req.body.addTo }).exec())
        await query.comment.push(newComment)
        await query.save()
        res.sendStatus(200)
    })

    app.post('/addquestion', async (req, res) => {
        let info = req.body

        let title = info.title
        let summary = info.summary
        let text = info.text
        let tag = info.tag
        let user = info.user

        const errorMess = []

        let userquery = await users.find({ _id: user }).exec()
        let userRep = userquery[0].reputation

        if (title.length == 0) {
            errorMess.push("Question title cannot be empty!")
        }
        if (title.length > 50) {
            errorMess.push("Question title cannot be more than 50 characters!")
        }
        if (summary.length > 140) {
            errorMess.push("Question summary cannot be more than 140 characters!")
        }
        let arrOfTag = tag.split(/[ ,]+/)
        let setOfTag = new Set(arrOfTag.map(item => item.toLowerCase()))
        let pretags = Array.from(setOfTag)

        for (let i = 0; i < pretags.length; i++) {
            let tempTag = await getTag(pretags[i])
            if ((tempTag === null && userRep < 100)) {
                errorMess.push("You need a least 100 reputation to create a new tag")
            }
        }
        const tagList = []
        if (errorMess.length > 0) {
            res.send(errorMess)
        } else {
            for (let i = 0; i < pretags.length; i++) {
                let tempTag = await getTag(pretags[i])
                if ((tempTag === null)) {
                    let newTag = await createTag(pretags[i], userquery[0])
                    tagList.push(newTag)
                } else {
                    tagList.push(tempTag)
                }
            }
            const uniqueTagList = [...new Set(tagList)]
            createQuestion(title, summary, text, uniqueTagList, [], userquery[0], new Date(), 0)
            res.sendStatus(200)
        }
    })

    app.post('/editquestion', async (req, res) => {
        let info = req.body

        let title = info.title
        let summary = info.summary
        let text = info.text
        let tag = info.tag
        let user = info.user
        let QID = info.QID

        const errorMess = []

        let userquery = await users.find({ _id: user }).exec()

        let userRep = userquery[0].reputation

        if (title.length == 0) {
            errorMess.push("Question title cannot be empty!")
        }
        if (title.length > 50) {
            errorMess.push("Question title cannot be more than 50 characters!")
        }
        if (summary.length > 140) {
            errorMess.push("Question summary cannot be more than 140 characters!")
        }
        let arrOfTag = tag.split(/[ ,]+/)
        let setOfTag = new Set(arrOfTag.map(item => item.toLowerCase()))
        let pretags = Array.from(setOfTag)

        for (let i = 0; i < pretags.length; i++) {
            let tempTag = await getTag(pretags[i])
            if ((tempTag === null && userRep < 100)) {
                errorMess.push("You need a least 100 reputation to create a new tag")
            }
        }
        const tagList = []
        if (errorMess.length > 0) {
            res.send(errorMess)
        } else {
            for (let i = 0; i < pretags.length; i++) {
                let tempTag = await getTag(pretags[i])
                if ((tempTag === null)) {
                    let newTag = await createTag(pretags[i], userquery[0])
                    tagList.push(newTag)
                } else {
                    tagList.push(tempTag)
                }
            }
            const uniqueTagList = [...new Set(tagList)]

            await questions.findOneAndUpdate({ _id: QID }, {
                title: title,
                summary: summary,
                text: text,
                tags: uniqueTagList,
            })
            res.sendStatus(200)
        }
    })

    app.post('/deletequestion', async (req, res) => {
        let QID = req.body.QID
        await questions.deleteOne({ _id: QID })
        res.sendStatus(200)
    })


    app.post('/addanswer', async (req, res) => {
        let newAnswer = req.body
        let queryUser = await users.findOne({ _id: newAnswer.ans_by }).exec()
        let queryQuestion = await questions.findOne({ _id: newAnswer.qid }).exec()
        let createdAnswer = await createAnswer(newAnswer.text, queryUser)
        await queryQuestion.answers.push(createdAnswer)
        await queryQuestion.save()
        res.sendStatus(200)
    })

    app.post('/editanswer', async (req, res) => {
        let info = req.body
        await answers.findOneAndUpdate({ _id: info.aid }, {
            text: info.text
        })
        res.sendStatus(200)
    })

    app.post('/deleteanswer', async (req, res) => {
        let info = req.body
        await answers.deleteOne({ _id: info.AID })
        await questions.findOneAndUpdate({ answers: info.AID }, { $pull: { answers: info.AID } }).exec()
        res.sendStatus(200)
    })

    app.post('/edittag', async (req, res) => {
        let info = req.body
        await tags.findOneAndUpdate({ name: info.tid }, {
            name: info.text
        })
        res.sendStatus(200)
    })

    app.post('/deletetag', async (req, res) => {
        let info = req.body
        let tag = await tags.deleteOne({ name: info.TID })
        let question = await questions.findOneAndUpdate({ tags: tag._id }, { $pull: { tags: tag._id } }).exec()
        while (question != null) {
            question = await questions.findOneAndUpdate({ tags: tag._id }, { $pull: { tags: tag._id } }).exec()
        }
        res.sendStatus(200)
    })

    app.post('/adduser', async (req, res) => {
        let newUser = req.body
        createUser(newUser.username, newUser.email, newUser.password)
        res.sendStatus(200)
    })

    app.post('/l', (req, res) => {
        store.destroy(err => { })
        res.sendStatus(200)
    })

})

//when logged in you should not get logged out when refreshed




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

function createTag(name, tag_by) {
    let tag = new tags({
        name: name,
        tag_by: tag_by
    });
    return tag.save();
}

function createAnswer(text, ans_by, ans_date_time, upvote, downvote, comment) {
    answerdetail = {
        text: text,
        ans_by: ans_by
    };
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (upvote != false) answerdetail.upvote = upvote
    if (downvote != false) answerdetail.downvote = downvote
    if (comment != false) answerdetail.comment = comment
    let answer = new answers(answerdetail);
    return answer.save();
}

function createQuestion(title, summary, text, tags, answers, asked_by, ask_date_time, views, upvote, downvote, comment) {
    qstndetail = {
        title: title,
        summary: summary,
        text: text,
        tags: tags,
        asked_by: asked_by
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (upvote != false) qstndetail.upvote = upvote
    if (downvote != false) qstndetail.downvote = downvote
    if (comment != false) qstndetail.comment = comment

    let qstn = new questions(qstndetail);
    return qstn.save();
}
function createComment(text, comment_by) {
    commentdetail = {
        text: text,
        comment_by: comment_by
    }
    let comment = new comments(commentdetail)
    return comment.save()
}


async function createUser(username, email, password) {
    userInner = {
        username: username,
        email: email,
        password: await bcrypt.hash(password, 12)
    }
    let user = new users(userInner)
    return user.save()
}

function getTag(name) {
    return tags.findOne({ name: name })
}
