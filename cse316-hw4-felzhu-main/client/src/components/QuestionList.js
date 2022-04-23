import React from 'react';
import Header from './Header.js'
import QuestionBody from './QuestionBody.js'
import axios from 'axios'

export default class QuestionList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            questions:[]
        }
    }
    componentDidMount() {
        axios.get('http://localhost:8000/questions').then(res => {
          this.setState({questions : res.data})
        })
    }
    render(){
        return(
            <table id="display">
                <Header 
                change_page={this.props.change_page}
                questionLength={this.state.questions.length}
                left={"Questions"}
                middle={"All Questions"}
                />
                <QuestionBody
                change_page={this.props.change_page}
                questions={this.state.questions}
                />
            </table>
            
        )
        
        
    }
}

