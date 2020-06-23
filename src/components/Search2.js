import React from 'react'

export default class Search2 extends React.Component{
    inputRef = React.createRef()

    handleClick = () => {
        const value = this.inputRef.current.value

        alert('The input value is' + value )
    }

    
    render(){
       return (
        <div>
            <input ref = {this.inputRef} type = 'text' name = 'username' placeholder = 'Enter Username' />
            <button onClick = {this.handleClick}>Click Me!</button>
        </div>
        )
    }
}