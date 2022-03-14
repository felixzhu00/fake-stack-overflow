import React from 'react';
import Model from '../models/model.js';

export default class FakeStackOverflow extends React.Component {
  constructor(props){
    super(props)
    this.model = new Model()
    this.state = {
      index: 0,      //0:Question, 1:NewQuestion, 2:Search, 3:Answer, 4:AnswerQuestion, 5:Tag, 6:TagResult
      searchText: '',
      currentAnswer: undefined,
      active: 0      //0:Questions, 1:Tags, 2:None
    }

    this.handleIndex = this.handleIndex.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleAnswer = this.handleAnswer.bind(this)
    this.handleActive = this.handleActive.bind(this)
  }
  
  handleIndex(index){
    this.setState({
      index:index
    })
  }

  handleSearch(searchText){
    this.setState({
      searchText:searchText
    })
  }


  handleAnswer(currentAnswer){
    this.setState({
      currentAnswer:currentAnswer
    })
  }

  handleActive(active){
    this.setState({
      active:active
    })
  }
  render() {
    var result
    switch(this.state.index){
      case 0:
        result = <DisplayTable case={this.state.index} key={this.state.index} model={this.model} handleIndex={this.handleIndex} handleAnswer={this.handleAnswer} handleActive={this.handleActive}/>
        break
      case 1:
        result = <DisplayForm case={this.state.index} model={this.model} handleIndex={this.handleIndex} handleActive={this.handleActive}/>
        break
      case 2:
        result = <DisplayTable case={this.state.index} key={this.state.index} model={this.model} handleIndex={this.handleIndex} searchText={this.state.searchText} answer={this.state.currentAnswer} handleAnswer={this.handleAnswer} handleActive={this.handleActive}/>
        break
      case 3:
        result = <DisplayTable case={this.state.index} key={this.state.index} model={this.model} handleIndex={this.handleIndex} handleAnswer={this.handleAnswer} answer={this.state.currentAnswer} handleActive={this.handleActive}/>
        break
      case 4:
        result = <DisplayForm case={this.state.index} model={this.model} handleIndex={this.handleIndex} qid={this.state.currentAnswer}handleActive={this.handleActive}/>
        break
      case 5:
        result = <DisplayTable case={this.state.index} key={this.state.index} model={this.model} handleIndex={this.handleIndex} handleAnswer={this.handleAnswer} searchText={this.state.searchText} handleSearch={this.handleSearch} handleActive={this.handleActive}/>
        break
      case 6:
        result = <DisplayTable case={this.state.index} key={this.state.index} model={this.model} handleIndex={this.handleIndex} handleAnswer={this.handleAnswer} searchText={this.state.searchText} handleSearch={this.handleSearch} handleActive={this.handleActive}/>
        break
      default:
        console.log("no state")
    }

    return (
      <div>
        <Banner handleIndex={this.handleIndex} handleSearch={this.handleSearch} searchText={this.state.searchText} handleActive={this.handleActive} active={this.state.active}/>
        {result}
      </div>
    )
  }
}
class Banner extends React.Component {  
  render() {
    return (
      <div id="banner" className="banner">
        <a className={this.props.active == 0? 'active': ''} id="questions" href="#" onClick = {(e) => {this.props.handleIndex(0); this.props.handleActive(0)}}>Questions</a>
        <a className={this.props.active == 1? 'active': ''} id="tags"href="#" onClick = {() => {this.props.handleIndex(5);this.props.handleActive(1)}}>Tags</a>
        <p className="title">Fake Stack Overflow</p>
        <SearchBar searchText={this.props.searchText} onSearch={this.props.handleSearch} handleIndex={this.props.handleIndex} handleActive={this.props.handleActive}/>
      </div>
    )
  }
}

class DisplayTable extends React.Component{
  search(input){
    const result =[]
    const words = input.split(/[ ]+/)
    const model = this.props.model
    
    for(let i = 0; i < words.length; i++){
      if(words[i].charAt(0) == "[" && words[i].charAt(words[i].length-1) == "]"){
        //tag
        var tag = words[i].substring(1,words[i].length-1).toLowerCase()
        var searchtag = []
        
        for(let j = 0; j < model.data.tags.length; j++){ 
          if(model.data.tags[j].name == tag){
            searchtag.push(model.data.tags[j].tid)
          }
        }  

        for(let j = 0; j < model.data.questions.length; j++){
          if(model.data.questions[j].tagIds.includes(searchtag[0]) && !(result.includes(model.data.questions[j].qid))){
            result.push(model.data.questions[j].qid)
          }
        }

      }else{
        //text
        for(let j = 0; j < model.data.questions.length; j++){
          if((model.data.questions[j].title.slice().split(/[ ]+/).some(e => e.toLowerCase() == words[i].toLowerCase()) || model.data.questions[j].text.slice().split(/[ ]+/).some(e => e.toLowerCase() == words[i].toLowerCase())) && !(result.includes(model.data.questions[j].qid))){
            result.push(model.data.questions[j].qid)
          }
        }
      }
    }
    return result //filtered qid
  }


  render(){
    const innerModel = this.props.model
    const filteredModel =  this.props.searchText === undefined ? undefined : this.search(this.props.searchText)
    const selectTab= (
      <table id="display">
        <TableHeader answer={this.props.answer} case={this.props.case} model ={innerModel} handleIndex={this.props.handleIndex} searchText={this.props.searchText} filteredModel={filteredModel} handleSearch={this.props.handleSearch} handleActive={this.props.handleActive}/>
        <TableBody answer={this.props.answer} case={this.props.case} model ={innerModel} handleAnswer={this.props.handleAnswer} handleIndex={this.props.handleIndex} searchText={this.props.searchText} filteredModel={filteredModel} handleSearch={this.props.handleSearch} handleActive={this.props.handleActive}/>
      </table>
    )

    return selectTab
  }
}

class DisplayForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      errorMess: [],
      title: '',
      text: '',
      tag: '',
      username: ''
    }
    this.handleErrorMess = this.handleErrorMess.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleTag = this.handleTag.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
  }

  handleErrorMess(errorMess){
    this.setState({
      errorMess:errorMess
    })
  }
  handleTitle(title){
    this.setState({
      title:title
    })
  }
  handleText(text){
    this.setState({
      text:text
    })
  }
  handleTag(tag){
    this.setState({
      tag:tag
    })
  }
  handleUsername(username){
    this.setState({
      username:username
    })
  }

  handleSubmit = (e) => {
    const isAnswer = this.props.case == 4
    
    this.handleErrorMess([])
    e.preventDefault()
    const title = isAnswer? undefined :e.target[0].value
    const text = isAnswer? e.target[0].value :e.target[1].value      //Ans
    const tag = isAnswer? undefined :e.target[2].value
    const username = isAnswer? e.target[1].value :e.target[3].value  //Ans

    const errorMess = []
    
    if(isAnswer){
      if(text.length == 0){
        errorMess.push(isAnswer?<p key={2}>Question text cannot be empty!</p>:<p key={2}>Answer text cannot be empty!</p>)
      }
      if(username.length > 15){
        errorMess.push(<p key={6}>Username cannot be more than 15 characters!</p>)
      }
    }else{
      if(title.length == 0){
        errorMess.push(<p key={1}>Question title cannot be empty!</p>)
      }
      if(text.length == 0){
        errorMess.push(isAnswer?<p key={2}>Question text cannot be empty!</p>:<p key={2}>Answer text cannot be empty!</p>)
      }
      if(tag.length == 0){
        errorMess.push(<p key={3}>Tags cannot be empty!</p>)
      }
      if(username.length == 0){
        errorMess.push(<p key={4}>Username cannot be empty!</p>)
      }
      if(title.length > 100){
        errorMess.push(<p key={5}>Question title cannot be more than 100 characters!</p>)
      }
      if(username.length > 15){
        errorMess.push(<p key={6}>Username cannot be more than 15 characters!</p>)
      }
    }
    if(errorMess.length > 0){
      this.handleErrorMess(errorMess)
    }else{
      let tempModel = this.props.model

      let months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
      let today = new Date();
      let mon = months[today.getMonth()]
      let day = String(today.getDate()).padStart(2, '0')
      let year = today.getFullYear()

      if(isAnswer){
        let answers = {
          aid: "a" + (tempModel.data.answers.length + 1),
          text: text,
          ansBy: username,
          ansOn: mon + " " + day + ", " + year,
          ansAt: String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0'),
        }

        tempModel.data.answers.push(answers)
        tempModel.data.questions.find(e => e.qid == this.props.qid).answers.push(answers.aid)
        this.props.handleIndex(3)
      }else{
        let arrOfTag = tag.split(/[ ,]+/)

        let setOfTag = new Set(arrOfTag.map(item => item.toLowerCase()))
        let pretags = Array.from(setOfTag)


        let posttag = []

        let container = []
        for(let i = 0; i < tempModel.data.tags.length; i++){
          container.push(tempModel.data.tags[i].name)
        }

        for(let i = 0; i < pretags.length; i++){
          if(container.includes(pretags[i].toLowerCase())){
            posttag.push("t" + (container.indexOf(pretags[i])+ 1))
          }else{
            let tag = {
              tid: "t" + (tempModel.data.tags.length + 1),
              name: pretags[i].toLowerCase()
            }
            posttag.push(tag.tid)
            tempModel.data.tags.push(tag)
          }
        }

        let question = {
          qid: "q" + (tempModel.data.questions.length + 1),
          title: title,
          text: text,
          tagIds: posttag,
          askedBy: username,
          askedOn: mon + " " + day + ", " + year,
          askedAt: String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0'),
          answers:[],
          views:0
        }

        tempModel.data.questions.push(question)
        this.props.handleIndex(0)
        
      }
      this.handleTitle('')
      this.handleText('')
      this.handleTag('')
      this.handleUsername('')
    }
  }
  render(){
    const questionForm = (
      <div id="askquestions" className="askquestions">
          <div id="error">{this.state.errorMess}</div>
          <form id="form" onSubmit = {this.handleSubmit}>
            <h2>Question Title</h2>
            <p>Title should not be more than 100 characters</p>
            <textarea type="text" name="qTitle" id="q1" rows="3" value={this.state.title} onChange={(e) => this.handleTitle(e.target.value)}></textarea>
            <h2>Question Text</h2>
            <p>Add details</p>
            <textarea type="text" name="qText" id="q2" rows="5" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>
  
            <h2>Tags</h2>
            <p>Add Keywords separated by whitespace</p>
            <textarea type="text"  name="qTag" id="q3" rows="3" value={this.state.tag} onChange={(e) => this.handleTag(e.target.value)}></textarea>
  
            <h2>Username</h2>
            <p>Should not be more than 15 characters</p>
            <textarea type="text" name="qUser" id="q4" rows="1" value={this.state.username} onChange={(e) => this.handleUsername(e.target.value)}></textarea>
  
            <button type="submit" className="ask1" id="ask1">Post Question</button>
          </form>
        </div>
    )

    const answerForm = (
      <div id="postanswer" className="postanswer">
        <div id="error">{this.state.errorMess}</div>
        <form id="form2" onSubmit = {this.handleSubmit}>
          <h2>Answer Text</h2>
          <textarea type="text" name="aText" id="a1" rows="8" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>
          
          <h2>Username</h2>
          <p>Should not be more than 15 characters</p>
          <textarea type="text" name="aUser" id="a2" rows="1" value={this.state.username} onChange={(e) => this.handleUsername(e.target.value)}></textarea>
      
          <button type="submit" className="ans1" id="ans1">Post Answer</button>
        </form>
      </div>
    )

    return(
      this.props.case == 4 ? answerForm: questionForm
    )
  }
}

class TableHeader extends React.Component{
  render(){
    let number = this.props.filteredModel === undefined? this.props.model.data.questions.length: this.props.filteredModel.length
    let middleCol = this.props.filteredModel === undefined? "All Questions": this.props.filteredModel.length == 0? "No Questions Found": "Search Results"
    if(this.props.case == 6){
      middleCol = "Questions Tagged " + this.props.searchText
    }


    if(this.props.case == 3){
      number = this.props.model.data.questions.find((e) => e.qid == this.props.answer).answers.length
      middleCol = this.props.model.data.questions.find((e) => e.qid == this.props.answer).title
    }
    if(this.props.case == 5){
      number = this.props.model.data.tags.length
      middleCol = "All Tags"
    }

    const displayQuestions = (
      <thead>
      <tr className = "h">
        <th className="h1" id="h1" colSpan="2">{number} Questions</th>
        <th className="h2" id="h2">{middleCol}</th>
        <th className="h3"><button className="ask" id="ask"  onClick = {() => {this.props.handleIndex(1); this.props.handleActive(2)}}>Ask a Question</button></th>
      </tr>
      </thead>
    )

    const displayAnswers = (
      <thead>
      <tr className = "h">
        <th className="h1" id="heading">{number} Answers</th>
        <th className="h2" id="heading">{middleCol}</th>
        <th className="h3"><button className="ask" id="ask" onClick = {() => {this.props.handleIndex(1); this.props.handleActive(2)}}>Ask a Question</button></th>
      </tr>
      </thead>
    )

    const displayTags =(
      <thead>
      <tr className = "h">
        <th className="h1" colSpan="2">{number} Tags</th>
        <th className="h2">{middleCol}</th>
        <th className="h3"><button className="ask" id="ask" onClick = {() => {this.props.handleIndex(1); this.props.handleActive(2)}}>Ask a Question</button></th>
      </tr>
      </thead>
    )

    return this.props.case == 3? displayAnswers : this.props.case == 5?displayTags:displayQuestions
  }
}

class TableBody extends React.Component{
  generateQuestion(){
    const innerModel = this.props.model
    const allQuestions = this.props.filteredModel === undefined? innerModel.data.questions.map(item => item.qid): this.props.filteredModel
    
    const oldModel = []

    for(let i = 0; i < allQuestions.length; i++){      
      var found = innerModel.data.questions.find(element => element.qid == allQuestions[i])
      let dictionary = {
        qid:allQuestions[i],
        date:new Date(found.askedOn + " " + found.askedAt)
      }
      oldModel.push(dictionary)
    }

    const newModel = oldModel.slice().sort((a,b) => b.date - a.date) //Sort

    const result = []

    for(let i = 0; i< newModel.length; i++){
      const order = newModel[i].qid.substring(1)
      const selectedQuestion = innerModel.data.questions[parseInt(order) - 1]


      const views = selectedQuestion.views
      const answers = selectedQuestion.answers.length
      const title = selectedQuestion.title
      const askedBy = selectedQuestion.askedBy
      const askedOn = selectedQuestion.askedOn
      const askedAt = selectedQuestion.askedAt
      
      const element = (
        <tr key={order}>
          <td className="e1">
            <ul>
              <li>{views}</li>
              <li>{answers}</li>
            </ul>
          </td>
          <td className="e2">
            <ul>
              <li>Views</li>
              <li>Answers</li>
            </ul>
          </td>
          <td className="e3">
            <ul>
              <li><a className="link" onClick={this.changeTabtoAnswer} qid={selectedQuestion.qid}>{title}</a></li>
              <TagList key={selectedQuestion.qid} tagList={selectedQuestion.tagIds} modelIdList={innerModel.data.tags}/>
            </ul>
          </td>
          <td className="e4">
            <ul>
              <li>Asked By <span className="by">{askedBy}</span></li>
              <li>On <span className="on">{askedOn}</span></li>
              <li>At <span className="at">{askedAt}</span></li>
            </ul>
          </td>
        </tr>
      )
      result.push(element)
    }
    return result
  }
  generateAnswer(){
    const result = []

    const innerModel = this.props.model
    const currentQuestion = innerModel.data.questions.find(e => e.qid == this.props.answer)
    const allAnswers = currentQuestion.answers

    const oldModel = []
    for(let i = 0; i < allAnswers.length; i++){      
      var found = innerModel.data.answers.find(element => element.aid == allAnswers[i])
      let dictionary = {
        aid:allAnswers[i],
        date:new Date(found.ansOn + " " + found.ansAt)
      }
      oldModel.push(dictionary)
    }

    const newModel = oldModel.slice().sort((a,b) => b.date - a.date) //Sort

    const questionObject = this.props.model.data.questions.find((e) => e.qid == this.props.answer)
    const views = questionObject.views
    const questionText = questionObject.text
    const askedBy = questionObject.askedBy
    const askedOn = questionObject.askedOn
    const askedAt = questionObject.askedAt

    const textElement = (
      <tr key={"Head"}>
        <td className='e2'>
          <ul>
            <li className='aviews'>{views} Views</li>
          </ul>
        </td>
        <td className='e3'>
          <ul>
            <li>{questionText}</li>
          </ul>
        </td>
        <td className='e4'>
          <ul>
            <li>Asked by <span className="by">{askedBy}</span></li>
            <li>On <span className="on">{askedOn}</span></li>
            <li>At <span className="at">{askedAt}</span></li>
          </ul>
        </td>
      </tr>
    )
    result.push(textElement)

    for(let i = 0; i < newModel.length; i++){
      const order = newModel[i].aid.substring(1)
      const selectedAnswer = innerModel.data.answers[parseInt(order) - 1]

      const answerText = selectedAnswer.text
      const ansBy = selectedAnswer.ansBy
      const ansOn = selectedAnswer.ansOn
      const ansAt = selectedAnswer.ansAt

      const answerElement = (
        <tr key={order}>
        <td className='e3' colSpan={2}>
          <ul>
            <li>{answerText}</li>
          </ul>
        </td>
        <td className='e4'>
          <ul>
            <li>Ans by <span className="by">{ansBy}</span></li>
            <li>On <span className="on">{ansOn}</span></li>
            <li>At <span className="at">{ansAt}</span></li>
          </ul>
        </td>
      </tr>
      )
      result.push(answerElement)
    }

    const buttElement = (
      <tr key={"button"}>
        <td colSpan={3} className={"diff"}>
        <button className='Aask' id="Aassk" onClick = {() => {this.props.handleIndex(4)}}> Answer Question</button>
      </td>
      </tr>
    )
    result.push(buttElement)

    return result
  }
  generateTag(){
    const innerModel = this.props.model
    const result = []

    let allTags = {
      tags:[
      ]
    }

    var listOfTags = []
    for(let i = 0; i < innerModel.data.tags.length; i++){
      listOfTags.push(innerModel.data.tags[i].tid)
    }
    for(let i = 0; i < listOfTags.length; i++){
      var temparr = []
      for(let j = 0; j < innerModel.data.questions.length; j++){
        if(innerModel.data.questions[j].tagIds.includes(listOfTags[i])){
          temparr.push(innerModel.data.questions[j].qid)
        }
      }
      let dictionary = {
        tid:listOfTags[i],
        qid:temparr
      }
      allTags.tags.push(dictionary)
    }

    for(let i = 0, area = []; i< allTags.tags.length; i++){
      if(area.length == 3){
        result.push(<tr key={i} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
        area = []
      }
      
      let found = innerModel.data.tags.find(element => element.tid == allTags.tags[i].tid)
      const containerElement = (
        <div key={i} className='containers'>
          <a href="#" className={found.name} onClick={() => {this.props.handleSearch("[" + found.name + "]");this.props.handleIndex(6); this.props.handleActive(2)}}>{found.name}</a>
          <span>{allTags.tags[i].qid.length} questions</span>
        </div>
      )
      area.push(containerElement)
      if(i == allTags.tags.length-1){
        result.push(<tr key={i+1} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
      }
    }
    
    return result
  }
  changeTabtoAnswer = (e) =>{
    const currentQID = e.target.getAttribute("qid")
    this.props.handleIndex(3)
    this.props.handleAnswer(currentQID)
    this.props.handleActive(2)
    const questionClicked = this.props.model.data.questions.find(e=>e.qid == currentQID)
    questionClicked.views = questionClicked.views+1
  }
  render(){
    const result = this.props.case == 3? this.generateAnswer() : this.props.case == 5? this.generateTag(): this.generateQuestion()
    return(<tbody>{result}</tbody>)    
  }

}

class TagList extends React.Component{
  render(){
    let questionTagList = this.props.tagList
    let modelTagList = this.props.modelIdList

    const result = []
    var containerList = []
    for(let i = 0; i < questionTagList.length;i++){
      if(i%4 == 0 && i != 0){
        result.push(<li key={i} className="tags">{containerList}</li>)
        containerList = []
      }
      if(i == questionTagList.length -1){
        result.push(<li key={i} className="tags">{containerList}</li>)
      }
      
      let found = modelTagList.find(element => element.tid == questionTagList[i])
      containerList.push(<span key={i}>{found.name}</span>)
    }
    return <div key={this.props.questionNumber}>{result}</div>
  }
}

class SearchBar extends React.Component{
  handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      this.props.handleIndex(2)
      this.props.handleActive(2)
      this.props.onSearch(e.target.value)
      e.target.value = ''
    }
  }

  render(){
    return(
      <input id="enter" type="text" placeholder="Search ..." className="searchbar" onKeyDown={this.handleKeyDown}/>
    )
  }




}
