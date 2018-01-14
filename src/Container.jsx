import React from 'react'
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import {
    BrowserRouter as Router,
    Route,
    Link
  } from 'react-router-dom'
import HomePage from './HomePage';

const answers = ['OC=O', 'Cc1ccc(C)cc1'];
const questions = [
    'Draw the simplest carboxylic acid (formic acid)!',
    'Draw p-xylene!'
];

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            actualAnswers: null,
            studysets: []
        }
    }

       componentDidMount() {


        fetch('/studysets')
            .then(res => res.json())
            .then(studysets => this.setState({ studysets }));

        console.log("study sets: ", this.state.studysets);
    }

    render() {
        return (
            // <div>
            //     {this.state.actualAnswers ?
            //      <Finish questions={questions} answers={answers} actualAnswers={this.state.actualAnswers} ></Finish> :
            //      <Home studyset={this.state.studysets.length > 0 ? this.state.studysets[0] : null} finish={this.finish.bind(this)} ></Home>}
            // </div>

            <Router>
                <div>
                <Route exact path="/" component={HomePage}/>
                <Route path="/studyset" component={Home}/>
                </div>
            </Router>
        );
    }

    finish(answers) {
        this.setState({
            actualAnswers: answers
        });
    }
};
