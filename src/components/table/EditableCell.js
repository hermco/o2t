import React from 'react';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import FormsyInput from '../FormsyInput';
import './EditableCell.css';

export default class EditableCell extends React.Component
{
    constructor(props)
    {
        super(props);

        this.cellInfo = {
            timestamp: this.props.timestamp,
            type: this.props.type,
        };

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    handleValidSubmit({ FormsyInput })
    {
        const updatedCellInfo = Object.assign(this.cellInfo, { value: parseFloat(FormsyInput) })
        console.log('updatedCellInfo :', updatedCellInfo);
        this.props.onCellUpdate(updatedCellInfo);
    }

    render()
    {
        return (
            <td className="EditableCell-td">
                <Formsy onValidSubmit={this.handleValidSubmit}>
                    <FormsyInput
                        id={this.props.id}
                        name="FormsyInput"
                        validations={{ matchRegexp: /^[0-9]+(\.[0-9]+)?$/ }}
                        validationError="This is not a valid decimal number"
                        value={this.props.value.toFixed(2)}
                        required
                    />
                    <button type="submit" disabled={false} style={{ display: 'none' }} />
                </Formsy>
            </td >
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