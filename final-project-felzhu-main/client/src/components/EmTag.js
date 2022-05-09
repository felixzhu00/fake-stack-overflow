import React from 'react';

export default class EmTag extends React.Component {
  render() {
    let questionTagList = this.props.tagList
    const result = []
    var containerList = []
    for (let i = 0; i < questionTagList.length; i++) {
      if (i % 4 == 0 && i != 0) {
        result.push(<li key={i} className="tags">{containerList}</li>)
        containerList = []
      }
      if (i == questionTagList.length - 1) {
        result.push(<li key={i} className="tags">{containerList}</li>)
      }
      containerList.push(<span key={i}>{questionTagList[i].name}</span>)
    }
    return <div key={this.props.questionNumber}>{result}</div>
  }
}