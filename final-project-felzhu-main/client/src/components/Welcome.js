import React from 'react';

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="promt">
                <h1>Welcome</h1>
                <button className="welcomebutt" onClick={() => this.props.change_page("Register")}>Register as New User</button>
                <button className="welcomebutt" onClick={() => this.props.change_page("Login")}>Login as existing User</button>
                <button className="welcomebutt" onClick={() => this.props.change_page("QuestionList")}>Continue as Guest</button>
            </div>

        )
    }
}

