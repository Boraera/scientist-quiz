import React from 'react';
import { render } from 'react-dom';
import Container from './Container';
import { BrowserRouter } from 'react-router-dom'

const answers = ['ccc', 'ccc', 'cco', 'cpon', 'ccccc', 'ccccc'];
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
        <Container></Container>
    </BrowserRouter>
  ), document.getElementById('root'))
