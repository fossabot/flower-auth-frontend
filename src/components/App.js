import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { requireAuth } from '../auth'
import EditProfile from './EditProfile'
import DecisionCardList from './DecisionCardList'
import IconTesting from './IconTesting'
import MatrixTryOut from './MatrixTryOut'
import Wizard from './Wizard'
import agent from 'superagent'
import DecisionAppBar from './DecisionAppBar'
import DecisionBottomNavigation from './DecisionBottomNavigation'
import AnimatedList from './AnimatedList'

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

const api_server_name = process.env.REACT_APP_API_SERVER_NAME
const api_server_port = process.env.REACT_APP_API_SERVER_PORT

class App extends Component {
  constructor() {
    super()
    this.state = {
      filteredDecisions: [],
      allDecisions: []
    }
  }

  componentDidMount() {
    agent.get('http://' + api_server_name + ':' + api_server_port + '/api/Decisions')
      //agent.get('http://localhost:3000/api/Decisions')
      .then(function (res) {
        this.setState({ allDecisions: res.body });
        this.setState({ filteredDecisions: res.body })
      }.bind(this));
  }

  filterDecisions(filter) {
    console.log('Decision Filter: ', filter)
    if (filter !== "All") {
      this.setState({
        filteredDecisions: this.state.allDecisions.filter(function (decision) {
          return decision.definition.category === filter
        })
      })
    } else {
      this.setState({
        filteredDecisions: this.state.allDecisions.filter(function (decision) {
          return decision
        })
      })
    }
  }
  render() {
    return (
      <div>
        <DecisionAppBar filterDecisions={this.filterDecisions.bind(this)} />
        <Router history={browserHistory}>
          <Route path="/" component={() => (<DecisionCardList decisions={this.state.filteredDecisions} />)} />
          {/* Testing Routes */}
          <Route path="/animatedList" component={AnimatedList} />
          <Route path="/matrix" component={MatrixTryOut} />
          <Route path="/icons" component={IconTesting} />
          {/* End Testing Routes */}
          <Route onEnter={requireAuth}>
            {/* Place all authenticated routes here */}
            <Route path="/profile/edit" component={EditProfile} />
            <Route path="/wizard" component={Wizard} />
          </Route>
        </Router>
        <DecisionBottomNavigation />
      </div>
    );
  }
}

export default App