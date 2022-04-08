import React from 'react';
export default class Header extends React.Component{
    

    render(){ 
        let number = this.props.questionLength + " "
        let post = this.props.left
        let middle = this.props.middle === "Search Result" && this.props.questionLength === 0 ? "No Questions Found" : this.props.middle
        let isAnswer = this.props.isAnswer === undefined ? "" : "heading"

        const display = (
            <thead>
            <tr className = "h">
              <th className="h1" id={isAnswer} colSpan={isAnswer?"0":"2"}>{number}{post}</th>
              <th className="h2" id={isAnswer}>{middle}</th>
              <th className="h3"><button className="ask" id="ask" onClick = {(e) => {this.props.change_page("AskQuestion")}}>Ask a Question</button></th>
            </tr>
            </thead>
        )
        return display
            
        
    }
}