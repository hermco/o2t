import React from 'react';
import PropTypes from 'prop-types';
import './EditableCell.css';

export default class EditableCell extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            value: this.props.value.toFixed(2)
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleKeyDown(e, cellId)
    {
        if (e.keyCode === 13) //enter key
        {
            this.props.onCellUpdate(e, cellId);
        }
    }

    handleChange({ target: { value } })
    {
        this.setState({ value: parseInt(value, 10)});
    }


    render()
    {
        const cellId = {
            timestamp: this.props.timestamp,
            type: this.props.type
        };

        return (
            <td className="EditableCell-td">
                <input className="EditableCell-input" type='text' id={this.props.id} value={this.state.value}
                    onChange={this.handleChange} onKeyDown={(e) => this.handleKeyDown(e, cellId)} />
            </td>
        );

    }
}

EditableCell.propTypes = {
    data: PropTypes.number,
    onCellUpdate: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired, //what type of stock : cac40, etc ...
};