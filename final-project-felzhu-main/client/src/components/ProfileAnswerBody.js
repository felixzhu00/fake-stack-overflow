import React from 'react';
import EmTag from './EmTag';
import Comment from './Comment';
import Vote from './Vote';

export default class AnswerBody extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0
    }
    this.handleCurrentPage = this.handleCurrentPage.bind(this)

  }
  handleCurrentPage(currentPage) {
    this.setState({
      currentPage: currentPage
    })
  }



  render() {
    let answers = this.props.answers

    const result = []

    let start = this.state.currentPage * 5
    let counts = Math.min(5, answers.length - start)

    for (let i = start; i < start + counts; i++) {
      var options = { year: 'numeric', month: 'short', day: 'numeric' };
      const wholeTime = answers[i].ans_date_time
      const ansOn = new Date(wholeTime).toLocaleDateString("en-US", options)
      const ansAt = ('0' + new Date(wholeTime).getHours()).substr(-2) + ":" + ('0' + new Date(wholeTime).getMinutes()).substr(-2) + ":" + ('0' + new Date(wholeTime).getSeconds()).substr(-2)

      const answerElement = (
        <tr key={answers[i]._id} className={this.props.hoverable ? "hoverable" : ""} onClick={() => { if (this.props.hoverable) this.props.change_page("ED:A:" + answers[i]._id) }}>
          <td className='e1'>
            <ul>
              <Vote aid={answers[i]._id} userID={this.props.userID} handleVote={this.props.handleKey} />
            </ul>
          </td>
          <td className='e2'>
            <ul>
              <li className='aviews'>{answers[i].upvote.length - answers[i].downvote.length} Votes</li>
            </ul>
          </td>
          <td className='e3'>
            <ul>
              <li>{answers[i].text}</li>
              <Comment key={ansOn} comment={answers[i].comment} userID={""} addTo={answers[i]._id} isQuestion={false} handleKey={this.props.handleKey} />
            </ul>
          </td>
          <td className='e4'>
            <ul>
              <li>Ans by <span className="by">{answers[i].ans_by.username}</span></li>
              <li>On <span className="on">{ansOn}</span></li>
              <li>At <span className="at">{ansAt}</span></li>
            </ul>
          </td>
        </tr>
      )
      result.push(answerElement)
    }

    let hasNext = (answers.length > this.state.currentPage * 5 + 5)
    let hasPrev = (this.state.currentPage * 5 > 0)

    let prev = (<td className='left-butt' colSpan={2}><button className={hasPrev ? "" : "hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage - 1) }}>Prev</button></td>)
    let next = (<td className='right-butt'><button className={hasNext ? "" : "hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage + 1) }}>Next</button></td>)

    const buttElement = (
      <tr key={"button"}>
        {prev}
        {next}
      </tr>
    )
    result.push(buttElement)


    return <tbody>{result}</tbody>

  }
}