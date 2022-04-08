import React from 'react';
import EmTag from './EmTag';

export default class AnswerBody extends React.Component {
  render() {
    let answers = this.props.answers
    let question = this.props.question
    const result = []

    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    const wholeTime = question.ask_date_time
    const askedOn = new Date(wholeTime).toLocaleDateString("en-US", options)
    const askedAt = ('0' + new Date(wholeTime).getHours()).substr(-2) + ":" + ('0' + new Date(wholeTime).getMinutes()).substr(-2)

    const textElement = (
      <tr key={"Head"}>
        <td className='e2'>
          <ul>
            <li className='aviews'>{question.views} Views</li>
          </ul>
        </td>
        <td className='e3'>
          <ul>
            <li>{question.text}</li>
          </ul>
        </td>
        <td className='e4'>
          <ul>
            <li>Asked by <span className="by">{question.asked_by}</span></li>
            <li>On <span className="on">{askedOn}</span></li>
            <li>At <span className="at">{askedAt}</span></li>
          </ul>
        </td>
      </tr>
    )
    result.push(textElement)


    for (let i = 0; i < answers.length; i++) {
      var options = { year: 'numeric', month: 'short', day: 'numeric' };
      const wholeTime = answers[i].ans_date_time
      const ansOn = new Date(wholeTime).toLocaleDateString("en-US", options)
      const ansAt = ('0' + new Date(wholeTime).getHours()).substr(-2) + ":" + ('0' + new Date(wholeTime).getMinutes()).substr(-2)

      const answerElement = (
        <tr key={answers[i]._id}>
          <td className='e3' colSpan={2}>
            <ul>
              <li>{answers[i].text}</li>
            </ul>
          </td>
          <td className='e4'>
            <ul>
              <li>Ans by <span className="by">{answers[i].ans_by}</span></li>
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
          <button className='Aask' id="Aassk" onClick={() => { this.props.change_page("AnswerQuestion:" + question._id) }}> Answer Question</button>
        </td>
      </tr>
    )
    result.push(buttElement)



    return <tbody>{result}</tbody>

  }
}