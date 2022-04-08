import React from 'react';
import EmTag from './EmTag';
import axios from 'axios';

export default class QuestionBody extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    axios.get(`http://localhost:8000/incrementView/${this.props.questions[e.target.id]._id}`).then(res => {
      this.props.change_page("Question:" + this.props.questions[e.target.id]._id)
    })

  }

  render() {

    let questions = this.props.questions
    let rows = []
    for (let i = 0; i < questions.length; i++) {

      var options = { year: 'numeric', month: 'short', day: 'numeric' };
      const wholeTime = questions[i].ask_date_time
      const askedOn = new Date(wholeTime).toLocaleDateString("en-US", options)
      const askedAt = ('0' + new Date(wholeTime).getHours()).substr(-2) + ":" + ('0' + new Date(wholeTime).getMinutes()).substr(-2)

      let element = (
        <tr key={questions[i]._id}>
          <td className="e1">
            <ul>
              <li>{questions[i].views}</li>
              <li>{questions[i].answers.length}</li>
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
              <li><a className="link" id={i} onClick={this.handleClick} >{questions[i].title}</a></li>
              <EmTag key={questions[i]._id} tagList={questions[i].tags} />
            </ul>
          </td>
          <td className="e4">
            <ul>
              <li>Asked By <span className="by">{questions[i].asked_by}</span></li>
              <li>On <span className="on">{askedOn}</span></li>
              <li>At <span className="at">{askedAt}</span></li>
            </ul>
          </td>
        </tr>
      )
      rows.push(element)
    }

    return <tbody>{rows}</tbody>
  }
}