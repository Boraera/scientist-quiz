import React from 'react'
import { Route } from 'react-router';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import axios from 'axios';

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            actualAnswers: [],
            studysets: [],
            workouts: [],
            submitted: false
        }
        this.finish = this.finish.bind(this);
    }

    componentDidMount() {      
        fetch('/studysets')
            .then(res => res.json())
            .then(studysets => this.setState({ studysets}));   
    }

    render() {
        return (
            <div>
                {this.state.actualAnswers.length ?
                 <Finish title={this.state.studysets[0].name} exercises={this.state.studysets[0].exercises} actualAnswers={this.state.actualAnswers} submitted={this.state.submitted} finish={this.finish} ></Finish> : 
                 <Home studysets={this.state.studysets} finish={this.finish} ></Home>}
            </div>
        );
    }

    submitStudySet(answers, score, isCorrect) {  
        axios({
            method: 'post',
            url: '/workouts',
            data: {
                author: 'Erika',
                studyset: this.state.studysets[0]._id,
                answers: answers,
                score: score,
                isCorrect: isCorrect
            }
        }).catch(e => { console.log(e); });
   }

    finish(answers, submit, score, isCorrect) {
        if (submit){
            this.submitStudySet(answers, score, isCorrect);
            this.state.submitted = true;
        }
        this.setState({
            actualAnswers: answers
        });
    }
};
