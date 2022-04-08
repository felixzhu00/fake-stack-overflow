import axios from 'axios';
import React from 'react';
import AnswerBody from './AnswerBody.js';
import Header from './Header.js'

export default class Answer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            question: [],
            answers: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/answer/${this.props.qid}`).then(res => {
            this.setState({
                question: res.data.question,
                answers: res.data.answer
            })
        })
    }
    render() {
        return (
            <table id="display">
                <Header
                    change_page={this.props.change_page}
                    questionLength={this.state.answers.length}
                    left={"Answers"}
                    middle={this.state.question.title}
                    isAnswer={"true"}
                />
                <AnswerBody
                    change_page={this.props.change_page}
                    answers={this.state.answers}
                    isAnswer={"true"}
                    question={this.state.question}
                />
            </table>
        )
    }
}