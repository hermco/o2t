import React from 'react';
import Graph from '../components/Graph';
import Table from '../components/Table';
import "./Home.css";

const API_URL = "http://127.0.0.1:8000/?count=";
const NB_COUNT = 20;

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: {},
            isLoading: false,
            error: null,
        };

        this.onCellUpdate = this.onCellUpdate.bind(this);
        this.fetchWithRetry = this.fetchWithRetry.bind(this);
        this.onSuccessfulFetch = this.onSuccessfulFetch.bind(this);
    }

    componentDidMount()
    {
        this.setState({ isLoading: true });
        const url = API_URL + NB_COUNT;
        this.fetchWithRetry(url, 25, this.onSuccessfulFetch);
        /* then make this call again every X ms */
        this.interval = setInterval(() => this.fetchWithRetry(url, 30, this.onSuccessfulFetch), 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.interval); // avoid memory leak
    }

    onSuccessfulFetch(data)
    {

        /* convert the array fetched into an object to have easy access through an id (timestamp for us) */
        const arrayToObject = (array, keyField) =>
            array.reduce((obj, item) =>
            {
                //if it already existed in our old data
                if (this.state.data.hasOwnProperty(item[keyField]))
                    obj[item[keyField]] = this.state.data[item[keyField]]; //return the previous object with this timestamp
                //else just get the new data
                else
                    obj[item[keyField]] = item;
                return obj;
            }, {})

        const formatedData = arrayToObject(data, "timestamp");

        this.setState({ data: formatedData, isLoading: false })
    }

    fetchWithRetry(url, limit, successCallback) // mainly used to wait for the server to boot, so he can send 20 stocks
    {
        fetch(url)
            .then(response =>
            {
                if (response.ok)
                {
                    return response.json();
                } else
                {
                    throw new Error('Couldn\'t collect data ...');
                }
            })
            .then(data =>
            {
                if (data.length === NB_COUNT)
                    successCallback(data);
                else if ((data.length < NB_COUNT) && limit) //try again until we have the number of stocks expected or we reach the limit
                    setTimeout(() =>
                    {
                        return this.fetchWithRetry(url, --limit, successCallback);
                    }, 1000);
                else
                    throw new Error('Couldn\'t get ' + NB_COUNT + ' stocks, maximum number of retries reached');
            })
            .catch(error => this.setState({ error, isLoading: false }));
    }

    onCellUpdate({ target: { value } }, { timestamp, type })
    {
        if (this.state.data.hasOwnProperty(timestamp))
        {
            let clonedData = JSON.parse(JSON.stringify(this.state.data)); //copy
            clonedData[timestamp].stocks[type] = parseInt(value, 10);
            this.setState({ data: clonedData });
        }
    }

    render()
    {
        if (this.state.isLoading)
            return <p>Loading {NB_COUNT} stocks ...</p>;

        if (this.state.error)
            return <p>{this.state.error.message}</p>;

        return (
            <div className="Home">
                <div className="Home-graph">
                    <Graph data={this.state.data} />
                </div>
                <div className="Home-table">
                    <Table data={this.state.data} onCellUpdate={this.onCellUpdate} />
                </div>
            </div>
        );
    }
}

