import React from 'react'
import { Route } from 'react-router';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';

const answers = ['ccc', 'ccc', 'cco', 'cpon', 'ccccc1', 'ccccc'];
const questions = [
    'Draw the simplest carboxylic acid (formic acid)!',
    'Hydrogenase this (E)-2-butene!',
    'Perform oxidation on butanol!',
    'Draw p-xylene!',
    'Draw the 2-butene isomer which has the higher melting point!',
    'Draw the ester which has raspberry odor!'
];

export default class Container extends React.Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={() => <Home questions={questions} finish={console.log} ></Home>} />
                <Route path="/finish" component={() => <Finish questions={questions} answers={answers} ></Finish>} />
                <Route path="/results" component={Results} />
            </div>
        );
    }
};
