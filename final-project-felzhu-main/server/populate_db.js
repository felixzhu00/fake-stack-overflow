// Run this script to test your schema
// Start the mongoDB service before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comments = require('./models/comments.js')
let Users = require('./models/users.js')

let bcrypt = require('bcrypt')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];

function userCreate(username, email, password, reputation, register_date){
  userdetail = {
    username:username,
    email:email,
    password:password,
  }
  if(reputation != false) userdetail.reputation = reputation
  if(register_date != false) userdetail.register_date = register_date

  let user = new Users(userdetail)
  return user.save()
}

function tagCreate(name, tag_by) {
  let tag = new Tag({
    name: name,
    tag_by:tag_by
  });
  return tag.save();
}

function commentCreate(text,comment_by){
  commentdetail = {
    text: text,
    comment_by: comment_by
  }
  let comment = new Comments(commentdetail)
  return comment.save()
}

function answerCreate(text, ans_by, ans_date_time, upvote, downvote, comment) {
  answerdetail = {
    text:text,
    ans_by:ans_by
  };
  if(ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if(upvote != false) answerdetail.upvote = upvote
  if(downvote != false) answerdetail.downvote = downvote
  if(comment != false) answerdetail.comment = comment
  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, upvote, downvote, comment) {
  qstndetail = {
    title: title,
    summary:summary,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if(upvote != false) qstndetail.upvote = upvote
  if(downvote != false) qstndetail.downvote = downvote
  if(comment != false) qstndetail.comment = comment

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  try {
    //Create users
    let u1 = await userCreate("some1", "some1@gmail.com", await bcrypt.hash("123", 12), false, false);
    let u2 = await userCreate("some2", "some2@gmail.com", await bcrypt.hash("1234", 12), 100, false);
    let u3 = await userCreate("some3", "some3@gmail.com", await bcrypt.hash("1235", 12), 50, false);
    let u4 = await userCreate("some4", "some4@gmail.com", await bcrypt.hash("1236", 12), 101, false);
    let u5 = await userCreate("some5", "some5@gmail.com", await bcrypt.hash("1237", 12), 150, false);
    let u6 = await userCreate("some6", "some6@gmail.com", await bcrypt.hash("1238", 12), 30, false);
    let u7 = await userCreate("some7", "some7@gmail.com", await bcrypt.hash("1239", 12), 0, false);
    //Create tags
    let t1 = await tagCreate('react', u1);
    let t2 = await tagCreate('javascript', u2);
    let t3 = await tagCreate('android-studio', u3);
    let t4 = await tagCreate('shared-preferences',u4);
    //Create comments
    let c1 = await commentCreate("comment1", u5)
    let c2 = await commentCreate("comment2", u6)
    let c3 = await commentCreate("comment3", u7)
    let c4 = await commentCreate("comment4", u1)
    //Create answers
    let a1 = await answerCreate("answer1", u1, false, false, false, [c1]);
    let a2 = await answerCreate("answer2", u2, false, false,false, [c2]);
    let a3 = await answerCreate("answer3", u3, false, false,false, [c3]);
    let a4 = await answerCreate("answer4", u4, false, false,false, [c4]);
    let a5 = await answerCreate("answer5", u1, false, false,false, [c1,c2,c3,c4]);
    let a6 = await answerCreate("answer6", u1, false, false,false, [c1,c2,c3,c4]);
    // //Create questions
    await questionCreate("question1", "summary1", "text1", [t1, t2], [a1, a2, a6,a3, a4, a5], u1, false, false, [u1, u2], [u3,u3], [c1,c2,c3,c4]);
    await questionCreate("question2", "summary2", "text2",  [t3, t4, t2], [a3, a4, a5], u2, false, 121, [], [], [c3]);
    await questionCreate("question3", "summary3", "text3", [t1, t2], [a1, a2, a6], u1, false, false, [u1, u2], [u3,u3], [c1,c2,c3,c4]);
    await questionCreate("question4", "summary4", "text4",  [t3, t4, t2], [a3, a4, a5], u2, false, 121, [], [], [c3]);
    await questionCreate("question5", "summary5", "text5", [t1, t2], [a1, a2, a6], u1, false, false, [u1, u2], [u3,u3], [c1,c2,c3,c4]);
    await questionCreate("question6", "summary6", "text6",  [t3, t4, t2], [a3, a4, a5], u2, false, 121, [], [], [c3]);
  }
  catch(err) {
    console.log('ENTRY ERROR! ' + err.message);
  }
  finally {
      if(db) db.close();
      console.log('done');
  }
}

populate();
console.log('processing ...');

