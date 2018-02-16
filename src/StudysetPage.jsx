import React from 'react';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import axios from 'axios';

/**
 * This component represents the studyset the user is currently working on
 */
export default class StudysetPage extends React.Component {
    constructor() {
        super();
        this.state = {
            actualAnswers: [],
            workouts: [],
            submitted: false
        }
        this.finish = this.finish.bind(this);
    }

    render() {
        return (
            <div>
                {this.state.actualAnswers.length ?
                <Finish title={this.state.studysets[0].name} exercises={this.state.studysets[0].exercises} actualAnswers={this.state.actualAnswers} submitted={this.state.submitted} finish={this.finish} ></Finish> : 
                <Home studysets={this.props.studysets} finish={this.finish} ></Home>}
            </div>
        );
    }

    submitStudySet(answers) {
        axios({
            method: 'post',
            url: '/workouts',
            data: {
                author: 'Erika',
                studyset: this.props.studysets[0]._id,
                answers: answers
            }
        }).catch(e => { console.log(e); });
        /**/
        fetch('/workouts')
            .then(res => res.json())
            .then(workouts => this.setState({ workouts}));
    }

    finish(answers, submit, score) {
        if (submit){
            this.submitStudySet(answers, score);
            this.state.submitted = true;
        }
        this.setState({
            actualAnswers: answers
        });
        console.log("actual answers: ", this.state.actualAnswers);
    }
}