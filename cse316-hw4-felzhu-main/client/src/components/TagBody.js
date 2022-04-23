import React from "react";

export default class TagBody extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e) {
        this.props.change_page("SearchTag:[" + e.target.innerHTML + "]")
    }


    render() {
        let tags= this.props.tags
        let result = []

        var area = []
        let counter = 0
        for(let i = 0; i < tags.length; i++){
            if (area.length === 3) {
                result.push(<tr key={i} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
                area = []
            }
            const containerElement = (
                <div key={i} className='containers'>
                    <a href="#" className={i} onClick={this.handleClick}>{tags[i].name}</a>
                    <span>{tags[i].tagLength} questions</span>
                </div>
            )
            area.push(containerElement)
            if (tags.length - 1 === counter) {
                result.push(<tr key={i} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
            }
            counter++
        }

        return <tbody>{result}</tbody>
    }
}
