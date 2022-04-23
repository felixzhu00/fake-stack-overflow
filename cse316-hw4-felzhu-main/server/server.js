// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

//Import requires
var mysql      = require('mysql');
var Answer = require('./db/Answer');
var Question = require('./db/Question');
var Tag = require('./db/Tag');
var express = require('express');
var cors = require('cors')

//Establish connection
let userArgs = process.argv.slice(2);

user = userArgs[1];
pass = userArgs[3];

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : user,
  password : pass,
  database : 'fake_so'
});

//Express port
const app = express();
const port = 8000;


//GET
app.use(cors());
app.get('/questions', async (req, res) => {
  Question.get_all_questions(res, connection)
})

app.get('/tags/:qid', async (req, res) => {
  var id = req.params.qid
  Tag.find_question(res,connection,id)
})

app.get('/incrementView/:currentQID', async (req, res) => {
  var id = req.params.currentQID
  Question.increment_view_question(res,connection,id)
})

app.get('/answer/:QID', async (req, res) => {
  var qid = req.params.QID

  let queryQuestion = ``
  let queryAnswers = ``

  await Question.get_one(connection, qid)
  .then(function(results){queryQuestion = results[0]})
  .catch(function(err){console.log("error:" + err)})
  
  await Answer.get_all(connection, qid)
  .then(function(results){queryAnswers = results})
  .catch(function(err){console.log("error:" + err)})
  
  res.send({ question: queryQuestion, answer: queryAnswers})
})

app.get('/searchQ/:filter', async (req, res) => {
  let input = req.params.filter
  let words = input.split(/[ ]+/)
  Question.search(res, connection, words)
})

app.get('/displayTags', async (req, res) => {
  Tag.display_all_tags(res,connection)
})

//POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/addquestion', async (req, res) => {
  let newQuestion = req.body
  const tagList = []

  for (let i = 0; i < newQuestion.tags.length; i++) {
      let tempTag = ""
      
      await Tag.get_one(connection, newQuestion.tags[i])
      .then(function(results){tempTag = results[0]})
      .catch(function(err){console.log("error:" + err)})

      if ((tempTag === undefined)) {
        let newTagId = ""
        await Tag.create_tag(connection, newQuestion.tags[i])
        .then(function(results){newTagId = results})
        .catch(function(err){console.log("error:" + err)})
        tagList.push(newTagId) //tagid
      } else {
          tagList.push(tempTag.tid) //tagid
      }
  }
  let qid = ""
  await Question.post_question(connection,newQuestion.title,newQuestion.text,newQuestion.ask_by,newQuestion.views)
  .then(function(results){qid = results})
  .catch(function(err){console.log("error:" + err)})

  for(let i = 0; i< tagList.length; i++){
    await Tag.create_qt(connection, qid, tagList[i])
    .catch(function(err){console.log("error:" + err)})
  }
  res.sendStatus(200)
})

app.post('/addanswer', async (req, res) => {
  let newAnswer = req.body
  let newAnswerId = ""

  await Answer.create_one(connection, newAnswer.text, newAnswer.ans_by)
  .then(function(results){newAnswerId = results})
  .catch(function(err){console.log("error:" + err)})

  await Answer.create_qa(connection, newAnswer.qid, newAnswerId)
  .then(function(results){newAnswerId = results})
  .catch(function(err){console.log("error:" + err)})

  res.sendStatus(200)

})

process.on('SIGINT', () => {
  if (connection) {
      connection.end()
      console.log('Server closed. Database instance disconnected')
  }
  process.exit()
})
//Listen for Port
app.listen(port, () => {
})