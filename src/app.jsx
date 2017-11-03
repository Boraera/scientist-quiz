import React from 'react';
import { render } from 'react-dom';
import Container from './Container';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import { BrowserRouter } from 'react-router-dom'
import { Route } from 'react-router';

const answers = ['ccc', 'ccc', 'cco', 'cpon', 'ccccc1', 'ccccc'];
const questions = [
    'Draw the simplest carboxylic acid (formic acid)!',
    'Hydrogenase this (E)-2-butene!',
    'Perform oxidation on butanol!',
    'Draw p-xylene!',
    'Draw the 2-butene isomer which has the higher melting point!',
    'Draw the ester which has raspberry odor!'
];

render((
    <BrowserRouter>
        <Container>
            <Route exact path="/" component={Home} />
            <Route path="/finish" component={() => <Finish questions={questions} answers={answers} ></Finish>} />
            <Route path="/results" component={Results} />
        </Container>
    </BrowserRouter>
  ), document.getElementById('root'))
