import React from 'react';
import axios from 'axios'
export default class AskQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMess: [],
      title: '',
      summary: '',
      text: '',
      tag: '',
      taglist: []
    }
    this.handleErrorMess = this.handleErrorMess.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleTag = this.handleTag.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSummary = this.handleSummary.bind(this)
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

  handleSummary(summary) {
    this.setState({
      summary: summary
    })
  }


  handleSubmit(e) {
    this.handleErrorMess([])
    e.preventDefault()

    const title = e.target[0].value
    const summary = e.target[1].value
    const text = e.target[2].value
    const tag = e.target[3].value
    const errorMess = []
    const user = this.props.userID

    let info = {
      title: title,
      summary: summary,
      text: text,
      tag: tag,
      user: user
    }

    axios.post(`http://localhost:8000/addquestion`, info).then(res => {
      if (res.data.length > 0 && res.data != "OK") {
        const errorMess = []
        for (let i = 0; i < res.data.length; i++) {
          errorMess.push(<p key={i}>{res.data[i]}</p>)
        }
        this.handleErrorMess(errorMess)
      } else {
        this.props.change_page("QuestionList")
      }
    })
    this.handleTitle('')
    this.handleText('')
    this.handleTag('')
    this.handleSummary('')
  }



  render() {
    const questionForm = (
      <div id="askquestions" className="askquestions">
        <div id="error">{this.state.errorMess}</div>
        <form id="form" onSubmit={this.handleSubmit}>
          <h2>Question Title</h2>
          <p>Title should not be more than 50 characters</p>
          <textarea type="text" name="qTitle" id="q1" rows="3" value={this.state.title} onChange={(e) => this.handleTitle(e.target.value)}></textarea>

          <h2>Question Summary</h2>
          <p>Summary should not be more than 140 characters</p>
          <textarea type="text" name="qSummary" id="q4" rows="3" value={this.state.summary} onChange={(e) => this.handleSummary(e.target.value)}></textarea>


          <h2>Question Text</h2>
          <p>Add details</p>
          <textarea type="text" name="qText" id="q2" rows="5" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>

          <h2>Tags</h2>
          <p>Add Keywords separated by whitespace</p>
          <textarea type="text" name="qTag" id="q3" rows="3" value={this.state.tag} onChange={(e) => this.handleTag(e.target.value)}></textarea>

          <button type="submit" className="ask1" id="ask1">Post Question</button>
        </form>
      </div>
    )
    return questionForm
  }
}