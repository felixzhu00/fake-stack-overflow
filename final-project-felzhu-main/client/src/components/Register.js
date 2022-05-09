import React from 'react';
import axios from 'axios'

export default class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMess: [],
            username: '',
            email: '',
            password: '',
            vpassword: ''
        }
        this.handleErrorMess = this.handleErrorMess.bind(this)
        this.handleUsername = this.handleUsername.bind(this)
        this.handleEmail = this.handleEmail.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.handleVPassword = this.handleVPassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleErrorMess(errorMess) {
        this.setState({
            errorMess: errorMess
        })
    }
    handleUsername(username) {
        this.setState({
            username: username
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
    handleVPassword(vpassword) {
        this.setState({
            vpassword: vpassword
        })
    }

    handleSubmit(e) {
        this.handleErrorMess([])
        e.preventDefault()

        const username = e.target[0].value
        let email = e.target[1].value
        const password = e.target[2].value
        const vpassword = e.target[3].value
        const errorMess = []

        const emailArr = email.split("@")

        const isEmail = emailArr.length > 1 && emailArr[1].split(".").length > 1



        const emailId = emailArr[0]

        if (vpassword !== password) {
            errorMess.push(<p key={1}>Entered passwords does not match</p>)
        }
        if (password.includes(emailId)) {
            errorMess.push(<p key={2}>Your password can not have your emailId in it</p>)
        }
        if (password.includes(username)) {
            errorMess.push(<p key={3}>Your password can not have your username in it</p>)
        }
        if (username.length === 0) {
            errorMess.push(<p key={4}>Username cannot be empty!</p>)
        }
        if (password.length === 0) {
            errorMess.push(<p key={5}>Password cannot be empty!</p>)
        }
        if (!isEmail) {
            errorMess.push(<p key={6}>Email incorrect format</p>)
        }
        if (email.length === 0) {
            errorMess.push(<p key={7}>Email cannot be empty!</p>)
            email = ""
        }
        if (isEmail) {
            axios.get(`http://localhost:8000/e/${email}`).then(res => {
                if (res.data) {
                    errorMess.push(<p key={8}>Email already exist in database</p>)
                }
                if (errorMess.length > 0) {
                    this.handleErrorMess(errorMess)
                } else {
                    let user = {
                        username: username,
                        email: email,
                        password: password
                    }
                    axios.post('http://localhost:8000/adduser', user).then(res => {
                        this.props.change_page("Welcome")
                    })
                }
                this.handleUsername('')
                this.handleEmail('')
                this.handlePassword('')
                this.handleVPassword('')
            })
        } else {
            if (errorMess.length > 0) {
                this.handleErrorMess(errorMess)
            }
        }
        this.handleUsername('')
        this.handleEmail('')
        this.handlePassword('')
        this.handleVPassword('')





    }
    render() {
        const registerForm = (
            <div className='promt'>
                <div id="askquestions" className="askquestions">
                    <div id="error">{this.state.errorMess}</div>
                    <form id="form" onSubmit={this.handleSubmit}>
                        <h2>Username</h2>
                        <p>Enter your desired username</p>
                        <input type="text" name="username" value={this.state.username} onChange={(e) => this.handleUsername(e.target.value)}></input>
                        <h2>Email</h2>
                        <p>Enter your desired email</p>
                        <input type="text" name="email" value={this.state.email} onChange={(e) => this.handleEmail(e.target.value)}></input>
                        <h2>Password</h2>
                        <p>Enter your desired password</p>
                        <input type="text" name="password" value={this.state.password} onChange={(e) => this.handlePassword(e.target.value)}></input>
                        <h2>Verify Password</h2>
                        <p>Re-enter your password</p>
                        <input type="text" name="vpassword" value={this.state.vpassword} onChange={(e) => this.handleVPassword(e.target.value)}></input>

                        <button type="submit" className="ask1" id="ask1">Register</button>
                    </form>
                </div>
                <button onClick={() => { this.props.change_page("Welcome") }} className='left'>Back to Welcome Page</button>
            </div>
        )
        return (
            registerForm
        )
    }
}

