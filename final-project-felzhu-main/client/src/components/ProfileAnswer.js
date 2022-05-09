import axios from 'axios';
import React from 'react';
import ProfileAnswerBody from './ProfileAnswerBody.js';

export default class ProfileAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            answers: [],
        }
    }
    componentDidMount() {
        axios.get(`http://localhost:8000/profileanswer/${this.props.userID}`).then(res => {
            this.setState({
                answers: res.data.answer
            })
        })
    }
    render() {
        return (
            <table id="display">
                <thead>
                    <tr className="h">
                        <th className="h1" id="heading" colSpan={2}>{this.state.answers.length} Answers</th>
                        <th className="h2" id="heading" >All Answers Your Posted</th>
                        <th className="hidden" id="h3">filler</th>
                    </tr>
                </thead>
                <ProfileAnswerBody
                    handleKey={this.props.handleKey}
                    userID={this.props.userID}
                    change_page={this.props.change_page}
                    answers={this.state.answers}
                    isAnswer={"true"}
                    hoverable={true}
                />
            </table>
        )
    }
}