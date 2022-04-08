import React from 'react';
import axios from 'axios'
export default class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMess: [],
            text: '',
            username: ''
        }
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleText = this.handleText.bind(this)
        this.handleUsername = this.handleUsername.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleErrorMess(errorMess) {
        this.setState({
            errorMess: errorMess
        })
    }

    handleText(text) {
        this.setState({
            text: text
        })
    }

    handleUsername(username) {
        this.setState({
            username: username
        })
    }

    handleSubmit(e) {
        console.log("answerQU")
        this.handleErrorMess([])
        e.preventDefault()
        const errorMess = []
        const text = e.target[0].value
        const username = e.target[1].value

        if (text.length == 0) {
            errorMess.push(<p key={0}>Answer text cannot be empty!</p>)
        }
        if (username.length == 0) {
            errorMess.push(<p key={2}>Username cannot be empty!</p>)
        }
        if (errorMess.length > 0) {
            this.handleErrorMess(errorMess)
        } else {
            let answer = {
                text: text,
                ans_by: username,
                qid: this.props.qid
            }
            axios.post(`http://localhost:8000/addanswer`, answer).then(res => {
                this.props.change_page("Question:" + this.props.qid)
            }
            )

        }
        this.handleText('')
        this.handleUsername('')
    }
    render() {
        const answerForm = (
            <div id="postanswer" className="postanswer">
                <div id="error">{this.state.errorMess}</div>
                <form id="form2" onSubmit={this.handleSubmit}>
                    <h2>Answer Text</h2>
                    <textarea type="text" name="aText" id="a1" rows="8" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>

                    <h2>Username</h2>
                    <p>Should not be more than 15 characters</p>
                    <textarea type="text" name="aUser" id="a2" rows="1" value={this.state.username} onChange={(e) => this.handleUsername(e.target.value)}></textarea>

                    <button type="submit" className="ans1" id="ans1">Post Answer</button>
                </form>
            </div>
        )


        return answerForm
    }
}