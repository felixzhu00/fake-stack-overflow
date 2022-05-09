import React from 'react';
import axios from 'axios';
export default class Vote extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            upvote: false,
            downvote: false,
        }
        this.handleCurrentPage = this.handleCurrentPage.bind(this)
        this.upvote = this.upvote.bind(this)
        this.downvote = this.downvote.bind(this)
        this.toggleUpvote = this.toggleUpvote.bind(this)
        this.toggleDownvote = this.toggleDownvote.bind(this)
    }

    handleCurrentPage(currentPage) {
        this.setState({
            currentPage: currentPage
        })
    }
    upvote(upvote) {
        this.setState({
            upvote: upvote
        })
    }
    downvote(downvote) {
        this.setState({
            downvote: downvote
        })
    }
    componentDidMount() {

        let isQuestion = this.props.qid ? true : false
        if (this.props.userID) {
            if (this.props.qid) {
                axios.get(`http://localhost:8000/vote/${this.props.qid}/${this.props.userID}/${isQuestion}`).then(res => {
                    this.upvote(res.data.upvote)
                    this.downvote(res.data.downvote)
                })
            } else {
                axios.get(`http://localhost:8000/vote/${this.props.aid}/${this.props.userID}/${isQuestion}`).then(res => {
                    this.upvote(res.data.upvote)
                    this.downvote(res.data.downvote)
                })
            }
        }

    }

    toggleUpvote() {
        let isQuestion = this.props.qid ? true : false
        if (this.props.qid) {
            axios.get(`http://localhost:8000/upvote/${this.props.qid}/${isQuestion}/${this.props.userID}`).then(res => {
                this.props.handleVote()
            })
        } else {
            axios.get(`http://localhost:8000/upvote/${this.props.aid}/${isQuestion}/${this.props.userID}`).then(res => {
                this.props.handleVote()
            })
        }
    }

    toggleDownvote() {
        let isQuestion = this.props.qid ? true : false
        if (this.props.qid) {
            axios.get(`http://localhost:8000/downvote/${this.props.qid}/${isQuestion}/${this.props.userID}`).then(res => {
                this.props.handleVote()
            })
        } else {
            axios.get(`http://localhost:8000/downvote/${this.props.aid}/${isQuestion}/${this.props.userID}`).then(res => {
                this.props.handleVote()
            })
        }
    }



    render() {
        return (this.props.userID ? <><div className={this.state.upvote ? 'up2 aviews' : 'up1 aviews'} onClick={() => { this.toggleUpvote() }}></div><div className={this.state.downvote ? 'down2 aviews' : 'down1 aviews'} onClick={() => { this.toggleDownvote() }}></div></> : <></>)
    }
}