import React from 'react';
import Answer from './Answer.js';
import AskQuestion from './AskQuestion.js';
import Banner from './Banner.js'
import QuestionList from './QuestionList.js';
import AnswerQuestion from './AnswerQuestion.js';
import TagList from './TagList.js';
import SearchList from './SearchList.js'
import Welcome from './Welcome.js'
import Register from './Register.js';
import Login from './Login.js';
import Profile from './Profile.js';
import ProfileTagList from './ProfileTagList.js';
import ProfileAnswer from './ProfileAnswer.js';
import ED from './ED.js';
import axios from 'axios';


export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: "Welcome",
      userID: "",
      key: 0
    }
    this.change_page = this.change_page.bind(this)
    this.change_login = this.change_login.bind(this)
    this.change_userID = this.change_userID.bind(this)
    this.handleKey = this.handleKey.bind(this)
  }
  handleKey() {
    this.setState({
      key: this.state.key + 1
    })
  }

  change_page(currentPage) {
    this.setState({
      currentPage: currentPage
    })
    axios.get(`http://localhost:8000/login/${currentPage}`, { withCredentials: true }).then(res => {
      this.change_userID(res.data)
      this.change_login(res.data ? true : false)
    })
  }

  change_login(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    })
  }

  change_userID(userID) {
    this.setState({
      userID: userID
    })
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/check`, { withCredentials: true }).then(res => {
      if (res.data.current) {
        this.change_userID(res.data.userID)
        this.change_page(res.data.current)
      } else {
        this.change_userID("")
        this.change_page("Welcome")
      }

    })
  }


  render() {

    let showBanner = false
    let result = (<div>
      404notFound
    </div>)


    if (this.state.currentPage === "QuestionList") {
      showBanner = true
      result = <QuestionList
        userID={this.state.userID}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("SearchList:") === 0) {
      showBanner = true
      result = <SearchList
        key={this.state.currentPage.substring(11)}
        change_page={this.change_page}
        filterText={this.state.currentPage.substring(11)}
      />
    } else if (this.state.currentPage === "TagList") {
      showBanner = true
      result = <TagList
        change_page={this.change_page}
      />
    }
    else if (this.state.currentPage === "AskQuestion") {
      showBanner = true
      result = <AskQuestion
        userID={this.state.userID}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("Question:") === 0) {
      showBanner = true
      result = <Answer
        key={this.state.key}
        handleKey={this.handleKey}
        userID={this.state.userID}
        qid={this.state.currentPage.substring(9)}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("AnswerQuestion:") === 0) {
      showBanner = true
      result = <AnswerQuestion
        userID={this.state.userID}
        change_page={this.change_page}
        qid={this.state.currentPage.substring(15)}
      />
    } else if (this.state.currentPage.indexOf("SearchTag:") === 0) {
      showBanner = true
      result = <SearchList
        change_page={this.change_page}
        filterText={this.state.currentPage.substring(10)}
        isTag={"true"}
      />
    } else if (this.state.currentPage === "Welcome") {
      result = <Welcome
        change_page={this.change_page} />
    } else if (this.state.currentPage === "Register") {
      result = <Register
        change_page={this.change_page} />
    } else if (this.state.currentPage === "Login") {
      result = <Login change_page={this.change_page}
        change_login={this.change_login}
        change_userID={this.change_userID} />
    } else if (this.state.currentPage === "Profile") {
      showBanner = true
      result = <Profile
        change_page={this.change_page}
        userID={this.state.userID} />
    } else if (this.state.currentPage === "ProfileTagList") {
      showBanner = true
      result = <ProfileTagList
        userID={this.state.userID}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage === "ProfileAnswer") {
      showBanner = true
      result = <ProfileAnswer
        key={this.state.key}
        handleKey={this.handleKey}
        userID={this.state.userID}
        qid={this.state.currentPage.substring(9)}
        change_page={this.change_page}
      />
    } else if (this.state.currentPage.indexOf("ED:") === 0) {
      showBanner = true
      result = <ED
        userID={this.state.userID}
        change_page={this.change_page}
        command={this.state.currentPage.substring(3)}
      />
    }


    return (
      <div>
        {showBanner ? <Banner currentPage={this.state.currentPage} change_page={this.change_page} userID={this.state.userID} /> : <></>}
        {result}
      </div>
    )
  }
}
