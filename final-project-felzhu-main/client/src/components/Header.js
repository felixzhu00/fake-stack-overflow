import React from 'react';
export default class Header extends React.Component {

    render() {
        let number = this.props.questionLength + " "
        let post = this.props.left
        let middle = this.props.middle === "Search Result" && this.props.questionLength === 0 ? "No Questions Found" : this.props.middle
        let isAnswer = this.props.isAnswer === undefined ? "" : "heading"

        const display = (
            <thead>
                <tr className="h">
                    <th className="h1" id={isAnswer} colSpan={2}>{number}{post}</th>
                    <th className="h2" id={isAnswer}>{middle}</th>
                    <th className={this.props.isAnswer ? "" : "hidden"} id="h3">{this.props.views} Views</th>
                </tr>
            </thead>
        )
        return display


    }
}