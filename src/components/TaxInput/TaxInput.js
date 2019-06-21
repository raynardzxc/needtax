import React from 'react';
import classes from './TaxInput.module.css';

const taxInput = (props) => {

    const years =[];
    
    for(var i=2015;i<=(new Date()).getFullYear();i++){
        years.push(<option value = {i.toString()}>{i}</option>)
    }
    let input = null;
    
    if (props.picker) {
        input = (
            <div className = {classes.inputBlock}>
                <p className = {classes.inputLabel}>{props.label}</p>
                <select 
                    required
                    className = {classes.inputField} 
                    value = {props.value}
                    name = {props.field}
                    onChange = {props.changed}>
                    {years}
                </select>
            </div>
        );
    } else {
        input = (
            <div className = {classes.inputBlock}>
                <p className = {classes.inputLabel}>{props.label}</p>
                <input 
                    required
                    className = {classes.inputField} 
                    type = 'number'
                    name = {props.field}
                    value = {props.value}
                    onChange = {props.changed}/>
            </div>
        );
    }

    return (
        <div>
            {input}
        </div>
    );
}

export default taxInput;