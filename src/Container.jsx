import React from 'react'
import { Route } from 'react-router';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';

const answers = ['c:c:c', 'c:c:c', 'c:c:o |lp:2:2|', 'c:p:o:[nH2] |lp:1:1,2:1,3:1|', 'c:c:c:c:c', 'c:c:c:c:c'];
const questions = [
    'Draw the simplest carboxylic acid (formic acid)!',
    'Hydrogenase this (E)-2-butene!',
    'Perform oxidation on butanol!',
    'Draw p-xylene!',
    'Draw the 2-butene isomer which has the higher melting point!',
    'Draw the ester which has raspberry odor!'
];

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            actualAnswers: null
        }
    }
    render() {
        return (
            <div>
                {this.state.actualAnswers ?
                 <Finish questions={questions} answers={answers} actualAnswers={this.state.actualAnswers} ></Finish> :
                 <Home questions={questions} finish={this.finish.bind(this)} ></Home>}
            </div>
        );
    }

    finish(answers) {
        this.setState({
            actualAnswers: answers
        });
    }
};
