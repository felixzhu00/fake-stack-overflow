import axios from 'axios';
import React from 'react';

export default class Banner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: ""
    }
    this.change_username = this.change_username.bind(this)
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.change_page("SearchList:" + e.target.value)
      e.target.value = ''
    }
  }

  handleLogout() {
    axios.post(`http://localhost:8000/l`).then(res => {
      this.props.change_page("Welcome")
    })
  }

  change_username(username) {
    this.setState({
      username: username
    })
  }

  componentDidMount() {
    if (this.props.userID) {
      axios.get(`http://localhost:8000/user/${this.props.userID}`).then(res => {
        this.change_username(res.data)
      })
    }

  }


  render() {
    let isQuestion = this.props.currentPage == "QuestionList"
    let isTag = this.props.currentPage == "TagList"

    let isLoggedIn = this.props.userID ? true : false

    return (
      <div id="banner" className="banner">
        <a className={isQuestion ? 'active' : ''} id="questions" href="#" onClick={(e) => { this.props.change_page("QuestionList") }}>Questions</a>
        <a className={isTag ? 'active' : ''} id="tags" href="#" onClick={(e) => { this.props.change_page("TagList") }}>Tags</a>
        <p className="title">Fake Stack Overflow</p>
        <button className={isLoggedIn ? "ask " : "ask hidden"} id="right-button" onClick={(e) => { this.props.change_page("AskQuestion") }}>Ask a Question</button>
        <a className={this.state.username !== "" ? "" : "hidden"} id="right" href="#" onClick={(e) => { this.handleLogout() }}>Logout</a>
        <a className={this.state.username !== "" ? "" : "hidden"} id="right" href="#" onClick={(e) => { this.props.change_page("Profile") }}>{this.state.username}</a>
        <a className={this.state.username == "" ? "" : "hidden"} id="right" href="#" onClick={(e) => { this.handleLogout() }}>Welcome Page</a>
        <input id="enter" type="text" placeholder="Search ..." className="searchbar" onKeyDown={this.handleKeyDown} />
      </div>
    )
  }
}