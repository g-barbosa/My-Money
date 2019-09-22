import React from 'react'
import Header from './elements/Header'
import Home from './pages/Home/index'
import Movimentacoes from './pages/Movimentacoes'

import {BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <Header/>
        <Route path='/' exact component={Home}/>
        <Route path='/movimentacoes/:data' component={Movimentacoes}/>
      </div>
    </Router>
  );
}

export default App
