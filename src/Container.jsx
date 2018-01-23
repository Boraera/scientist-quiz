import React from 'react'
import { Route } from 'react-router';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            actualAnswers: [],
            studysets: []
        }
        this.finish = this.finish.bind(this);
    }

    componentDidMount() {      
        fetch('/studysets')
            .then(res => res.json())
            .then(studysets => this.setState({ studysets}));
        console.log("study sets: ", this.state.studysets);    
    }

    render() {
        return (
            <div>
                {this.state.actualAnswers.length ?
                 <Finish exercises={this.state.studysets[0].exercises} actualAnswers={this.state.actualAnswers} ></Finish> :
                 <Home studysets={this.state.studysets} finish={this.finish} ></Home>}
            </div>
        );
    }

    finish(answers) {
        this.setState({
            actualAnswers: answers
        });
    }
};
