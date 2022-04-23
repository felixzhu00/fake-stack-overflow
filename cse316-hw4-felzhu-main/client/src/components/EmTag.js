import React from 'react';
import axios from 'axios';

export default class EmTag extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      tags: []
    }
  }
  componentDidMount() {
    axios.get(`http://localhost:8000/tags/${this.props.questionNum}`).then(res => {
      this.setState({tags: res.data})
    })
  }
  render() {
    let questionTagList = this.state.tags
    
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