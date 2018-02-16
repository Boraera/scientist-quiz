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
            workouts: []
        }
        this.finish = this.finish.bind(this);
    }

    render() {
        return (
            <div>
                {this.state.actualAnswers.length ?
                 <Finish exercises={this.props.studysets[0].exercises} actualAnswers={this.state.actualAnswers} ></Finish> :
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

    finish(answers) {
        this.submitStudySet(answers);
        this.setState({
            actualAnswers: answers
        });
        console.log("actual answers: ", this.state.actualAnswers);
    }
}