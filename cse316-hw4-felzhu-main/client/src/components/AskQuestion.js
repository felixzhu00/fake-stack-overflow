import React from 'react';
import axios from 'axios'
export default class AskQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMess: [],
      title: '',
      text: '',
      tag: '',
      username: '',
      taglist: []
    }
    this.handleErrorMess = this.handleErrorMess.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleTag = this.handleTag.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleErrorMess(errorMess) {
    this.setState({
      errorMess: errorMess
    })
  }
  handleTitle(title) {
    this.setState({
      title: title
    })
  }
  handleText(text) {
    this.setState({
      text: text
    })
  }
  handleTag(tag) {
    this.setState({
      tag: tag
    })
  }
  handleUsername(username) {
    this.setState({
      username: username
    })
  }

  handleSubmit(e) {
    this.handleErrorMess([])
    e.preventDefault()

    const title = e.target[0].value
    const text = e.target[1].value
    const tag = e.target[2].value
    const username = e.target[3].value
    const errorMess = []

    if (title.length == 0) {
      errorMess.push(<p key={1}>Question title cannot be empty!</p>)
    }
    if (text.length == 0) {
      errorMess.push(<p key={2}>Question text cannot be empty!</p>)
    }
    if (tag.length == 0) {
      errorMess.push(<p key={3}>Tags cannot be empty!</p>)
    }
    if (title.length > 100) {
      errorMess.push(<p key={5}>Question title cannot be more than 100 characters!</p>)
    }
    if (username.length > 15) {
      errorMess.push(<p key={6}>Username cannot be more than 15 characters!</p>)
    }
    if (errorMess.length > 0) {
      this.handleErrorMess(errorMess)
    } else {
      let arrOfTag = tag.split(/[ ,]+/)
      let setOfTag = new Set(arrOfTag.map(item => item.toLowerCase()))
      let pretags = Array.from(setOfTag)

      let question = {
        title: title,
        text: text,
        tags: pretags,
        answers: [],
        ask_by: username,
        ask_date_time: new Date(),
        views: 0
      }
      axios.post('http://localhost:8000/addquestion', question).then(res => {
        this.props.change_page("QuestionList")
      })
      
    }
    this.handleTitle('')
    this.handleText('')
    this.handleTag('')
    this.handleUsername('')
  }

  render() {
    const questionForm = (
      <div id="askquestions" className="askquestions">
        <div id="error">{this.state.errorMess}</div>
        <form id="form" onSubmit={this.handleSubmit}>
          <h2>Question Title</h2>
          <p>Title should not be more than 100 characters</p>
          <textarea type="text" name="qTitle" id="q1" rows="3" value={this.state.title} onChange={(e) => this.handleTitle(e.target.value)}></textarea>
          <h2>Question Text</h2>
          <p>Add details</p>
          <textarea type="text" name="qText" id="q2" rows="5" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>

          <h2>Tags</h2>
          <p>Add Keywords separated by whitespace</p>
          <textarea type="text" name="qTag" id="q3" rows="3" value={this.state.tag} onChange={(e) => this.handleTag(e.target.value)}></textarea>

          <h2>Username</h2>
          <p>Should not be more than 15 characters</p>
          <textarea type="text" name="qUser" id="q4" rows="1" value={this.state.username} onChange={(e) => this.handleUsername(e.target.value)}></textarea>

          <button type="submit" className="ask1" id="ask1">Post Question</button>
        </form>
      </div>
    )
    return questionForm
  }
}