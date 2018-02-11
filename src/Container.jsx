import React from 'react'
import {
    Route,
    BrowserRouter,
    Link
  } from 'react-router-dom';
import StudysetPage from './StudysetPage';
import StudysetListPage from './StudysetListPage';

export default class Container extends React.Component {

    constructor() {
        super();
        this.state = {
            studysets: []
        }
    }

    componentDidMount() {
        fetch('/studysets')
            .then(res => res.json())
            .then(studysets => this.setState({ studysets}))
            .catch(e => console.log(e));
        console.log("study sets: ", this.state.studysets);
    }

    render() {
        return (
            <BrowserRouter>
                    <div>
                    <Route exact path="/" render={(props) => (
                        <StudysetListPage {...props} studysets={this.state.studysets}/>
                    )}/>
                    <Route path="/studyset" component={StudysetPage}/>
                    </div>
            </BrowserRouter>
        );
    }
};
