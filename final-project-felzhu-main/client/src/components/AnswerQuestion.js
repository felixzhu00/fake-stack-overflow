import React from 'react';
import axios from 'axios'
export default class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMess: [],
            text: '',
        }
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleText = this.handleText.bind(this)
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


    handleSubmit(e) {
        this.handleErrorMess([])
        e.preventDefault()
        const errorMess = []
        const text = e.target[0].value

        if (text.length == 0) {
            errorMess.push(<p key={0}>Answer text cannot be empty!</p>)
        }
        if (errorMess.length > 0) {
            this.handleErrorMess(errorMess)
        } else {
            let answer = {
                text: text,
                ans_by: this.props.userID,
                qid: this.props.qid
            }
            axios.post(`http://localhost:8000/addanswer`, answer).then(res => {
                this.props.change_page("Question:" + this.props.qid)
            }
            )

        }
        this.handleText('')
    }
    render() {
        const answerForm = (
            <div id="postanswer" className="postanswer">
                <div id="error">{this.state.errorMess}</div>
                <form id="form2" onSubmit={this.handleSubmit}>
                    <h2>Answer Text</h2>
                    <textarea type="text" name="aText" id="a1" rows="8" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>

                    <button type="submit" className="ans1" id="ans1">Post Answer</button>
                </form>
            </div>
        )


        return answerForm
    }
}