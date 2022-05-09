import axios from 'axios';
import React from 'react';
import QuestionBody from './QuestionBody.js';

export default class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            since: 0,
            questions: [],
            answers: [],
            tags: [],
            reputation: 0
        }

    }
    componentDidMount() {
        axios.get(`http://localhost:8000/userprofile/${this.props.userID}`).then(res => {
            this.setState({
                questions: res.data.questions,
                answers: res.data.answers,
                tags: res.data.tags,
                reputation: res.data.reputation,
                since: (new Date() - new Date(res.data.since))
            })
        })

    }

    render() {
        let ms = this.state.since / (1000)

        let sec = Math.floor((ms) % 60)
        let min = Math.floor(((ms) / 60) % 60)
        let hr = Math.floor(((ms) / (60 * 60)) % 24)
        let day = Math.floor(((ms) / (60 * 60 * 60)))

        let questionPromt = (
            <table id="display">
                <thead>
                    <tr className="h">
                        <th className="h1" colSpan={2}>{this.state.questions.length} Questions</th>
                        <th className="h2">All Questions Asked</th>
                        <th className={"hidden"} id="h3">{this.props.views} Views</th>
                    </tr>
                </thead>
                <QuestionBody
                    change_page={this.props.change_page}
                    questions={this.state.questions}
                    hoverable={true}
                />
            </table>
        )


        let isTag = this.props.currentPage == "TagList"

        return (
            <>
                <div className='side-bar'>
                    <div className='space'>
                        <a className='pt' href="#" onClick={(e) => { this.props.change_page("ProfileTagList") }}>All Tags</a>
                        <a className='pt' href="#" onClick={(e) => { this.props.change_page("ProfileAnswer") }}>All Answer</a>
                    </div>
                </div>
                <div className='profile'>
                    <div className='pro'>Reputation: {this.state.reputation}</div>
                    <div className='pro'>You have been an member for: {day} days {hr} hours {min} minutes {sec} seconds</div>
                    <hr className="rounded"></hr>
                    {questionPromt}
                </div>
                <div className='whole'>

                </div>
            </>
        )
    }
}