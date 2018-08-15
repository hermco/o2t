import React from 'react';
import PropTypes from 'prop-types';
import EditableCell from './EditableCell'


export default class Row extends React.Component
{
    render()
    {

        const { onCellUpdate, data, rowName } = this.props;

        /* iterate over each stock and create a cell for each */
        let rowCells = [];
        Object.keys(data).forEach(key =>
        {
            rowCells.push(
                <EditableCell onCellUpdate={onCellUpdate} value={data[key].stocks[rowName]} key={data[key].timestamp} timestamp={data[key].timestamp} type={rowName} />
            );
        })

        return (
            <tr className="Row">
                <th>{rowName}</th>
                {rowCells}
            </tr>
        );
    }
}

Row.propTypes = {
    data: PropTypes.object.isRequired,
    onCellUpdate: PropTypes.func.isRequired,
    rowName: PropTypes.string.isRequired,
};