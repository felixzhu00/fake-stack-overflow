import React from 'react';
import axios from 'axios'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMess: [],
            email: '',
            password: ''
        }
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleEmail = this.handleEmail.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleErrorMess(errorMess) {
        this.setState({
            errorMess: errorMess
        })
    }
    handleEmail(email) {
        this.setState({
            email: email
        })
    }
    handlePassword(password) {
        this.setState({
            password: password
        })
    }
    handleSubmit(e) {
        this.handleErrorMess([])
        e.preventDefault()

        const email = e.target[0].value
        const password = e.target[1].value
        let errorMess = []


        axios.post(`http://localhost:8000/login`, { email: email, password: password }, { withCredentials: true }).then(res => {
            const tempArr = res.data.errorMess

            for (let i = 0; i < tempArr.length; i++) {
                errorMess.push(<p key={i}>{tempArr[i]}</p>)
            }
            if (errorMess.length > 0) {
                this.handleErrorMess(errorMess)
            } else {
                this.props.change_userID(res.data.userID)
                this.props.change_page("QuestionList")
            }
        })

        this.handleEmail('')
        this.handlePassword('')
    }
    render() {
        const loginForm = (
            <div className='promt'>
                <div id="askquestions" className="askquestions">
                    <div id="error">{this.state.errorMess}</div>
                    <form id="form" onSubmit={this.handleSubmit}>
                        <h2>Email</h2>
                        <p>Enter your email</p>
                        <input type="text" name="email" value={this.state.email} onChange={(e) => this.handleEmail(e.target.value)}></input>
                        <h2>Password</h2>
                        <p>Enter your password</p>
                        <input type="text" name="password" value={this.state.password} onChange={(e) => this.handlePassword(e.target.value)}></input>

                        <button type="submit" className="ask1" id="ask1">Login</button>
                    </form>
                    <button onClick={() => { this.props.change_page("Welcome") }} className='left'>Back to Welcome Page</button>
                </div>
            </div>

        )
        return (
            loginForm

        )
    }
}

