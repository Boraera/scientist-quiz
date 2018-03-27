import React from 'react';
import Home from './Home';
import Finish from './Finish';
import Results from './Results';
import axios from 'axios';
import {find, propEq} from 'ramda';

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
        console.log(this.props)
        return (
            <div>
                {this.state.actualAnswers.length ?
                <Finish title={this.findActualStudySet().name} exercises={this.findActualStudySet().exercises} actualAnswers={this.state.actualAnswers} submitted={this.state.submitted} finish={this.finish} ></Finish> : 
                <Home studyset={this.findActualStudySet()} finish={this.finish} ></Home>}
            </div>
        );
    }

    submitStudySet(answers, score, isCorrect) {  
        axios({
            method: 'post',
            url: '/workouts',
            data: {
                author: 'Erika',
                studyset: this.findActualStudySet()._id,
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

    findActualStudySet() {
        return find(propEq('_id', this.props.match.params.id))(this.props.studysets);
    }
 }