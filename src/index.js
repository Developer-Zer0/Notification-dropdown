import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './index.css';
//import App from './App';
import Navbar from './components/navbar/navbar.components'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Navbar />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
