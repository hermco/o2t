import React from 'react';
import Graph from '../components/Graph';
import Table from '../components/Table';
import ReactLoading from 'react-loading';
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
            nbFetched: 0,
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
        const dataObjectified = data.reduceRight((obj, item) =>
        {
            //if it already existed in our old data, keep the old one in case the user modified it
            if (this.state.data.hasOwnProperty(item["timestamp"]))
                obj[item["timestamp"]] = this.state.data[item["timestamp"]]; //return the previous object with this timestamp
            //else just get the new data
            else
                obj[item["timestamp"]] = item;
            return obj;
        }, {})


        this.setState({ data: dataObjectified, isLoading: false })
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
                {
                    this.setState({ nbFetched: data.length }, () =>
                        setTimeout(() =>
                        {
                            return this.fetchWithRetry(url, --limit, successCallback);
                        }, 1000)
                    );
                }
                else
                    throw new Error('Couldn\'t get ' + NB_COUNT + ' stocks, maximum number of retries reached');
            })
            .catch(error => this.setState({ error, isLoading: false }));
    }

    onCellUpdate({ timestamp, type, value })
    {
        if (this.state.data.hasOwnProperty(timestamp))
        {
            let clonedData = JSON.parse(JSON.stringify(this.state.data)); //copy
            clonedData[timestamp].stocks[type] = value; //update data
            this.setState({ data: clonedData });
        }
    }

    render()
    {
        if (this.state.isLoading)
        {
            return (
                <div className="Home">
                    <div className="Home-loading">
                        <p>Loaded {this.state.nbFetched}/{NB_COUNT} stocks</p>
                        <ReactLoading type="spin" color="#222" height={'100%'} width={'28px'} />
                    </div>
                </div>
            );
        }

        if (this.state.error)
        {
            return (
                <div className="Home">
                    <div className="Home-loading">
                        <p>The following error occured : {this.state.error.message}</p>
                    </div>
                </div>
            );
        }

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

