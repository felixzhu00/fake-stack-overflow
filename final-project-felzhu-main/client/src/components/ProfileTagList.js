import React from 'react';
import Header from './Header.js';
import TagBody from './TagBody.js'
import axios from 'axios';

export default class ProfileTagList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/profiledisplayTags/${this.props.userID}`).then(res => {
            this.setState({ tags: res.data })
        })
    }
    render() {
        return (

            <table id="display">
                <Header
                    left={"Tags"}
                    middle={"All Tags"}
                    change_page={this.props.change_page}
                    questionLength={Object.keys(this.state.tags).length}
                />
                <TagBody
                    change_page={this.props.change_page}
                    tags={this.state.tags}
                    hoverable={true}
                />
            </table>
        )
    }
}

