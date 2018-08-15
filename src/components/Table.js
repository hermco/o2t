import React from 'react';
import PropTypes from 'prop-types';
import Row from './table/Row';
import {Table as BootStrapTable} from 'react-bootstrap';
import './Table.css';

export default class Table extends React.Component
{
    render()
    {
        const { onCellUpdate, data } = this.props;
        return (
            <div className="Table">
                <h1>Stocks</h1>
                <BootStrapTable striped bordered className="Table-table">
                <tbody>
                        <Row onCellUpdate={onCellUpdate} data={data} rowName="NASDAQ" />
                        <Row onCellUpdate={onCellUpdate} data={data} rowName="CAC40" />
                    </tbody>
                </BootStrapTable>
            </div>
        );
    }
}

Table.propTypes = {
    data: PropTypes.object.isRequired,
    onCellUpdate: PropTypes.func.isRequired,
};

