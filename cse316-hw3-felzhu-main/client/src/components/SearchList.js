import React from 'react';
import axios from 'axios';
import Header from './Header';
import QuestionBody from './QuestionBody';

export default class SearchList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: []
        }
    }
    componentDidMount() {
        axios.get(`http://localhost:8000/searchQ/${this.props.filterText}`).then(res => {
            this.setState({ questions: res.data })
        })
    }
    render() {
        return (
            <table id="display">
                <Header
                    change_page={this.props.change_page}
                    questionLength={this.state.questions.length}
                    left={"Questions"}
                    middle={this.props.isTag ? "Questions tagged " + this.props.filterText : "Search Result"}
                />
                <QuestionBody
                    change_page={this.props.change_page}
                    questions={this.state.questions}
                />
            </table>

        )


    }
}