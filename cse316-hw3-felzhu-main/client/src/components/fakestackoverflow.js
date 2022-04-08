import React from 'react';
import Answer from './Answer.js';
import AskQuestion from './AskQuestion.js';
import Banner from './Banner.js'
import QuestionList from './QuestionList.js';
import AnswerQuestion from './AnswerQuestion.js';
import TagList from './TagList.js';
import SearchList from './SearchList.js'


export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: "QuestionList"
    }
    this.change_page = this.change_page.bind(this)
  }

  change_page(currentPage) {
    this.setState({
      currentPage: currentPage
    })
  }


  render() {
    let result = (<div>
      404notFound
    </div>)

    if (this.state.currentPage === "QuestionList") {
      result = <QuestionList
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("SearchList:") === 0) {
      result = <SearchList
        change_page={this.change_page}
        filterText={this.state.currentPage.substring(11)}
      />
    } else if (this.state.currentPage === "TagList") {
      result = <TagList
        change_page={this.change_page}
      />
    }
    else if (this.state.currentPage === "AskQuestion") {
      result = <AskQuestion
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("Question:") === 0) {
      result = <Answer
        qid={this.state.currentPage.substring(9)}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("AnswerQuestion:") === 0) {
      result = <AnswerQuestion
        change_page={this.change_page}
        qid={this.state.currentPage.substring(15)}
      />
    } else if (this.state.currentPage.indexOf("SearchTag:") === 0) {
      result = <SearchList
        change_page={this.change_page}
        filterText={this.state.currentPage.substring(10)}
        isTag={"true"}
      />
    }

    return (
      <div>
        <Banner currentPage={this.state.currentPage} change_page={this.change_page} />
        {result}

      </div>
    )
  }
}
