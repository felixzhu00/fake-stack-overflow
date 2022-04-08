import React from 'react';

export default class Banner extends React.Component {
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.change_page("SearchList:" + e.target.value)
      e.target.value = ''
    }
  }
  render() {

    let isQuestion = this.props.currentPage == "QuestionList"
    let isTag = this.props.currentPage == "TagList"

    return (
      <div id="banner" className="banner">
        <a className={isQuestion ? 'active' : ''} id="questions" href="#" onClick={(e) => { this.props.change_page("QuestionList") }}>Questions</a>
        <a className={isTag ? 'active' : ''} id="tags" href="#" onClick={(e) => { this.props.change_page("TagList") }}>Tags</a>
        <p className="title">Fake Stack Overflow</p>
        <input id="enter" type="text" placeholder="Search ..." className="searchbar" onKeyDown={this.handleKeyDown} />
      </div>
    )
  }
}