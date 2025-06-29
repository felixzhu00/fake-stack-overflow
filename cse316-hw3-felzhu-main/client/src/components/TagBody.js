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
        let jsonTag = this.props.tags

        let result = []

        var area = []
        let counter = 0
        for (var key of Object.keys(jsonTag)) {

            if (area.length === 3) {
                result.push(<tr key={key} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
                area = []
            }
            const containerElement = (
                <div key={key} className='containers'>
                    <a href="#" className={key} onClick={this.handleClick}>{key}</a>
                    <span>{jsonTag[key]} questions</span>
                </div>
            )
            area.push(containerElement)
            if (Object.keys(this.props.tags).length - 1 === counter) {
                result.push(<tr key={key} className='area'><td className='itemCont' colSpan={4}>{area}</td></tr>)
            }
            counter++
        }
        return <tbody>{result}</tbody>
    }
}