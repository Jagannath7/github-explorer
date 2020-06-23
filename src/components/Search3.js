import React from 'react'

export default class Search3 extends React.Component{
    
    handleClick = e => {
        if(e.keycode === 13){
            const value = e.target.value;
            alert("The input value is " + value)}
    };

    render(){
       return (
            <input onKeyDown= {this.handleClick} type = 'text' name = 'username' placeholder = 'Enter Username' />
        ) }
}