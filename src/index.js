import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import actionCable from 'actioncable'

const cableApp = {}

cableApp.cable = actionCable.createConsumer(`ws://${window.location.hostname}:3000/cable`)

ReactDOM.render(<App cableApp={cableApp}/>, document.getElementById('root'));
registerServiceWorker();
