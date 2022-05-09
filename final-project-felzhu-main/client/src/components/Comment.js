import React from 'react';
import axios from 'axios';
export default class Comment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 0,
            comment: '',
            errorMess: [],
            comment:[]
        }
        this.handleCurrentPage = this.handleCurrentPage.bind(this)
        this.handleComment = this.handleComment.bind(this)
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleErrorMess(errorMess) {
        this.setState({
            errorMess: errorMess
        })
    }
    handleCurrentPage(currentPage) {
        this.setState({
            currentPage: currentPage
        })
    }
    handleComment(comment) {
        this.setState({
            comment: comment
        })
    }
    handleSubmit(e) {
        this.handleErrorMess([])
        e.preventDefault()
        const errorMess = []
        const text = e.target[0].value

        let commentdetail = {
            question: this.props.isQuestion,
            addTo: this.props.addTo,
            text: text,
            comment_by: this.props.userID
        }

        axios.get(`http://localhost:8000/rep/${this.props.userID}`, commentdetail).then(res => {
            if (res.data < 100) {
                errorMess.push(<p key={0}>You need to have more than 100 reputation</p>)
            }
            if (text.length == 0) {
                errorMess.push(<p key={1}>Comment text cannot be empty!</p>)
            }
            if (errorMess.length > 0) {
                this.handleErrorMess(errorMess)
            } else {
                axios.post(`http://localhost:8000/addcomment`, commentdetail).then(res => {
                    this.props.handleKey()
                })
            }
        })
        this.handleComment('')
    }



    render() {
        let comment = this.props.comment

        let start = this.state.currentPage * 3
        let counts = Math.min(3, comment.length - start)

        let result = []

        for (let i = start; i < start + counts; i++) {
            if (i == start + counts - 1) {
                result.push(<div key={i} className="last"><span>{comment[i].text}</span><span className="user">{comment[i].comment_by.username}</span></div>)
            } else {
                result.push(<div key={i}><span>{comment[i].text}</span><span className="user">{comment[i].comment_by.username}</span></div>)
            }

        }

        let hasNext = (comment.length > this.state.currentPage * 3 + 3)
        let hasPrev = (this.state.currentPage * 3 > 0)

        let prev = (<div className='left-butt'><button className={hasPrev ? "" : "hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage - 1) }}>Prev</button></div>)
        let next = (<div className='right-butt'><button className={hasNext ? "" : "hidden"} onClick={() => { this.handleCurrentPage(this.state.currentPage + 1) }}>Next</button></div>)

        let newComment = (
            <div className='comment-form'>
                <div id="error">{this.state.errorMess}</div>
                <form id="form3" onSubmit={this.handleSubmit}>
                    <textarea type="text" name="comment" rows="1" value={this.state.comment} onChange={(e) => this.handleComment(e.target.value)}></textarea>
                    <button type="submit" className="subcom" id="ans1">Post Comment</button>
                </form>
            </div>
        )

        return <li className='comment'>{result}{prev}{next}{this.props.userID ? newComment : <></>}</li>



    }
}