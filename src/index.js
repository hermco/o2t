import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Home from './pages/Home';
import Header from './components/Header';
import './index.css';

class App extends Component
{
    render()
    {
        return (
            <div className="App">
                <div className="App-header">
                    <Header />
                </div>
                <div className="App-container">
                    <Home />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


/* Todo */
// input validation
// tests ?