import React from 'react';
import axios from 'axios'
export default class ED extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMess: [],
            title: '',
            summary: '',
            text: '',
            tag: '',
            question: []
        }
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleText = this.handleText.bind(this)
        this.handleTag = this.handleTag.bind(this)
        this.handleSummary = this.handleSummary.bind(this)
        this.handleSubmitQ = this.handleSubmitQ.bind(this)
        this.handleDeleteQ = this.handleDeleteQ.bind(this)
        this.handleSubmitA = this.handleSubmitA.bind(this)
        this.handleDeleteA = this.handleDeleteA.bind(this)
        this.handleSubmitT = this.handleSubmitT.bind(this)
        this.handleDeleteT = this.handleDeleteT.bind(this)
    }

    handleErrorMess(errorMess) {
        this.setState({
            errorMess: errorMess
        })
    }
    handleTitle(title) {
        this.setState({
            title: title
        })
    }
    handleText(text) {
        this.setState({
            text: text
        })
    }
    handleTag(tag) {
        this.setState({
            tag: tag
        })
    }

    handleSummary(summary) {
        this.setState({
            summary: summary
        })
    }

    componentDidMount() {
        let command = this.props.command
        let type = command.charAt(0)

        let id = command.substring(2)

        if (type === "Q") {
            axios.get(`http://localhost:8000/question/${id}`, { withCredentials: true }).then(res => {
                let tagList = ""
                for (let i = 0; i < res.data.tags.length; i++) {
                    tagList += (i == 0 ? "" : " ") + res.data.tags[i].name
                }
                this.setState({
                    question: res.data,
                    title: res.data.title,
                    summary: res.data.summary,
                    text: res.data.text,
                    tag: tagList
                })
            })
        } else if (type === "A") {
            axios.get(`http://localhost:8000/answers/${id}`, { withCredentials: true }).then(res => {
                this.setState({
                    text: res.data.text
                })
            })
        } else if (type === "T") {
            axios.get(`http://localhost:8000/tag/${id}`, { withCredentials: true }).then(res => {
                this.setState({
                    text: res.data.name
                })
            })
        }
    }


    handleSubmitQ(e) {
        this.handleErrorMess([])
        e.preventDefault()

        const errorMess = []
        let command = this.props.command
        let id = command.substring(2)
        const title = e.target[0].value
        const summary = e.target[1].value
        const text = e.target[2].value
        const tag = e.target[3].value
        const user = this.props.userID
        let info = {
            title: title,
            summary: summary,
            text: text,
            tag: tag,
            user: user,
            QID: id
        }
        axios.post(`http://localhost:8000/editquestion`, info).then(res => {
            if (res.data.length > 0 && res.data != "OK") {
                const errorMess = []
                for (let i = 0; i < res.data.length; i++) {
                    errorMess.push(<p key={i}>{res.data[i]}</p>)
                }
                this.handleErrorMess(errorMess)
            } else {
                this.props.change_page("Profile")
                this.handleTitle('')
                this.handleText('')
                this.handleTag('')
                this.handleSummary('')
            }
        })
    }

    handleDeleteQ() {
        let command = this.props.command
        let id = command.substring(2)

        let info = {
            QID: id
        }

        axios.post(`http://localhost:8000/deletequestion`, info).then(res => {
            this.props.change_page("Profile")
            this.handleTitle('')
            this.handleText('')
            this.handleTag('')
            this.handleSummary('')
        })
    }

    handleSubmitA(e) {
        let command = this.props.command
        let id = command.substring(2)

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
                aid: id
            }
            axios.post(`http://localhost:8000/editanswer`, answer).then(res => {
                this.props.change_page("Profile")
                this.handleText('')
            })
        }
    }

    handleDeleteA() {
        let command = this.props.command
        let id = command.substring(2)

        let info = {
            AID: id
        }

        axios.post(`http://localhost:8000/deleteanswer`, info).then(res => {
            this.props.change_page("Profile")
            this.handleText('')
        })

    }

    handleSubmitT(e) {
        let command = this.props.command
        let id = command.substring(2)

        this.handleErrorMess([])
        e.preventDefault()
        const errorMess = []
        const text = e.target[0].value

        if (text.length == 0) {
            errorMess.push(<p key={0}>Tag name cannot be empty!</p>)
        }
        if (errorMess.length > 0) {
            this.handleErrorMess(errorMess)
        } else {
            let tag = {
                text: text,
                tid: id
            }
            axios.post(`http://localhost:8000/edittag`, tag).then(res => {
                this.props.change_page("Profile")
                this.handleText('')
            })
        }

    }

    handleDeleteT() {
        let command = this.props.command
        let id = command.substring(2)
        let info = {
            TID: id
        }
        axios.post(`http://localhost:8000/deletetag`, info).then(res => {
            this.props.change_page("Profile")
            this.handleText('')
        })

    }



    render() {
        let result = []
        const questionForm = (
            <div id="askquestions" className="askquestions">
                <div id="error">{this.state.errorMess}</div>
                <form id="form" onSubmit={this.handleSubmitQ}>
                    <h2>Question Title</h2>
                    <p>Title should not be more than 50 characters</p>
                    <textarea type="text" name="qTitle" id="q1" rows="3" value={this.state.title} onChange={(e) => this.handleTitle(e.target.value)}></textarea>

                    <h2>Question Summary</h2>
                    <p>Summary should not be more than 140 characters</p>
                    <textarea type="text" name="qSummary" id="q4" rows="3" value={this.state.summary} onChange={(e) => this.handleSummary(e.target.value)}></textarea>


                    <h2>Question Text</h2>
                    <p>Add details</p>
                    <textarea type="text" name="qText" id="q2" rows="5" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>

                    <h2>Tags</h2>
                    <p>Add Keywords separated by whitespace</p>
                    <textarea type="text" name="qTag" id="q3" rows="3" value={this.state.tag} onChange={(e) => this.handleTag(e.target.value)}></textarea>

                    <button type="submit" className="ask1" id="ask1">Edit Question</button>
                    <button className="ask1" onClick={this.handleDeleteQ}>Delete</button>
                </form>

            </div>
        )
        const answerForm = (
            <div id="postanswer" className="postanswer">
                <div id="error">{this.state.errorMess}</div>
                <form id="form2" onSubmit={this.handleSubmitA}>
                    <h2>Answer Text</h2>
                    <textarea type="text" name="aText" id="a1" rows="8" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>
                    <button type="submit" className="ans1" id="ans1">Edit Answer</button>
                    <button className="ask1" onClick={this.handleDeleteA}>Delete</button>
                </form>
            </div>
        )

        const tagForm = (
            <div id="postanswer" className="postanswer">
                <div id="error">{this.state.errorMess}</div>
                <form id="form2" onSubmit={this.handleSubmitT}>
                    <h2>Tag name</h2>
                    <textarea type="text" name="aText" id="a1" rows="2" value={this.state.text} onChange={(e) => this.handleText(e.target.value)}></textarea>
                    <button type="submit" className="ans1" id="ans1">Edit Tag</button>
                    <button className="ask1" onClick={this.handleDeleteT}>Delete</button>
                </form>
            </div>
        )

        let type = this.props.command.charAt(0)

        if (type === "Q") {
            result = questionForm
        } else if (type === "A") {
            result = answerForm
        } else if (type === "T") {
            result = tagForm
        }
        return result
    }
}