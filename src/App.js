import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import StartPage from './components/start-page';
import Browse from './components/browse';
import Mash from './components/mash';
import Mix from './components/mix';
import Media from './components/media';
import Navbar from './components/navbar';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <div id="main-content" className="container">
            <Switch>
              <Route exact path="/" component={StartPage} />
              <Route path="/browse" component={Browse} />
              <Route path="/mash" component={Mash} />
              <Route path="/mix" component={Mix} />
              <Route path="/media" component={Media} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
