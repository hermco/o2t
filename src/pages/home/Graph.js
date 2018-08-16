import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';
import './Graph.css';

export default class Graph extends Component
{
    render()
    {
        const data = this.props.data;
        let graphData = [];
        let count = 0;
        Object.keys(data).forEach(key =>
        {
            count++;
            graphData.push({
                XAxisName: count,
                NASDAQ: data[key].stocks.NASDAQ,
                CAC40: data[key].stocks.CAC40,
            });
        })

        return (
            <div className="Graph">
                <LineChart width={1000} height={500} data={graphData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="XAxisName" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="NASDAQ" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="CAC40" stroke="#82ca9d" />
                </LineChart>
            </div>
        );

    }
}

Graph.propTypes = {
    data: PropTypes.object.isRequired,
};


