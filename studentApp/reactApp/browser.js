import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import { CookiesProvider } from 'react-cookie';



import Store from './store.js'

import Container from './src/components/container.jsx'
import TweetList from './src/components/tweetList.jsx'



ReactDOM.render(
//linking with redux
 <Provider store={Store}>
    <Container />
  </Provider>,
  document.getElementById('root')
);

//PS: You need to create and export this "container component" in src to work ok?
