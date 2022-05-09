import React from 'react';
import EmTag from './EmTag';
import axios from 'axios';

export default class QuestionBody extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handleCurrentPage = this.handleCurrentPage.bind(this)

  }
  handleClick(e) {
    axios.get(`http://localhost:8000/incrementView/${this.props.questions[e.target.id]._id}`).then(res => {
      this.props.change_page("Question:" + this.props.questions[e.target.id]._id)
    })

  }

  handleCurrentPage(currentPage) {
    this.setState({
      currentPage: currentPage
    })
  }

  handleUsername(username) {
    axios.get(`http://localhost:8000/user/${username}`).then(async res => {
      return await res.data
    })
  }

  render() {
    let questions = this.props.questions

    let start = this.state.currentPage * 5
    let counts = Math.min(5, questions.length - start)

    let rows = []
    for (let i = start; i < start + counts; i++) {
      var options = { year: 'numeric', month: 'short', day: 'numeric' };
      const wholeTime = questions[i].ask_date_time
      const askedOn = new Date(wholeTime).toLocaleDateString("en-US", options)
      const askedAt = ('0' + new Date(wholeTime).getHours()).substr(-2) + ":" + ('0' + new Date(wholeTime).getMinutes()).substr(-2) + ":" + ('0' + new Date(wholeTime).getSeconds()).substr(-2)

      let element = (
        <tr key={questions[i]._id} className={this.props.hoverable ? "hoverable" : ""} onClick={() => { if (this.props.hoverable) this.props.change_page("ED:Q:" + questions[i]._id) }}>
          <td className="e1">
            <ul>
              <li>{questions[i].views}</li>
              <li>{questions[i].answers.length}</li>
              <li>{questions[i].upvote.length - questions[i].downvote.length}</li>
            </ul>
          </td>
          <td className="e2">
            <ul>
              <li>Views</li>
              <li>Answers</li>
              <li>Votes</li>
            </ul>
          </td>
          <td className="e3">
            <ul>
              <li><a className="link" id={i} onClick={this.handleClick} >{questions[i].title}</a></li>
              <li className='summary'>{questions[i].summary}</li>
              <EmTag key={questions[i]._id} tagList={questions[i].tags} />
            </ul>
          </td>
          <td className="e4">
            <ul>
              <li>Asked By <span className="by">{questions[i].asked_by.username}</span></li>
              <li>On <span className="on">{askedOn}</span></li>
              <li>At <span className="at">{askedAt}</span></li>
            </ul>
          </td>
        </tr>
      )
      rows.push(element)
    }
    let hasNext = (questions.length > start + 5)
    let hasPrev = (start > 0)

    const buttElement = (
      <tr key={"button"} className='quesbutton'>
        <td colSpan={3}><button className={hasPrev ? "left-butt " : "left-butt hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage - 1) }}>Prev</button></td>
        <td><button className={hasNext ? "right-butt" : "right-butt hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage + 1) }}>Next</button></td>
      </tr>
    )

    return (
      <><tbody>{rows}</tbody><tbody>{buttElement}</tbody></>
    )


  }
}

