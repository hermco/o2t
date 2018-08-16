import React, { Component } from 'react';
import { withFormsy } from 'formsy-react';
import classNames from 'classnames';
import './FormsyInput.css';


class FormsyInput extends Component
{
    constructor(props)
    {
        super(props);

        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange({ currentTarget: { value } })
    {
        this.props.setValue(value); /* Beware : this calls a setState, which is asynchronous */
    }

    render()
    {
        const className = classNames("Formsy-input", {
            "Formsy-input-error": !this.props.isValidValue(),
        });

        return (
            <input
                onChange={this.onValueChange}
                type="text"
                value={this.props.getValue() || ''}
                className={className}
                required
            />
        );

    }
}

export default withFormsy(FormsyInput);