import React from 'react'
import { Route } from 'react-router';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';

const answers = ['OC=O', 'Cc1ccc(C)cc1'];
const questions = [
    'Draw the simplest carboxylic acid (formic acid)!',
    'Draw p-xylene!'
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
