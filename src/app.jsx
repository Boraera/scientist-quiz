import React from 'react'
import { render } from 'react-dom'
import Container from './Container';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router'

render((
    <BrowserRouter>
        <Container>
            <Route exact path="/" component={Home} />
            <Route path="/finish" component={Finish} />
            <Route path="/results" component={Results} />
        </Container>
    </BrowserRouter>
  ), document.getElementById('root'))
