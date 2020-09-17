import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

import SplashScreen from './components/SplashScreen';
import Play from './components/Play';
import Layout from './components/Layout';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
   <Router>
     <Layout>
       <Switch>
         <Route exact path="/" component={SplashScreen} />
         <Route path="/:type" component={Play} />
       </Switch>
     </Layout>
   </Router> 
   , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
