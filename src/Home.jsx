import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
require('./marvinjs_launcher');
require('./Home.scss');
import Promise from 'es6-promise';
import Button from 'material-ui/Button';
import axios from 'axios';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            questionIndex: 0,
            answers: [],
            workouts: []
        };
        this.next = this.next.bind(this);   
    }

    componentDidMount() {
        let sketcherAttributes = {
            id: 1,
            src: '../marvinjs/editor.html',
            name: 'marvin',
            'data-toolbars': 'markush'
        };

        
        const container = ReactDom.findDOMNode(this.wrapper);
        $(container).append($('<iframe>', sketcherAttributes));

        MarvinJSUtil.getPackage('#' + sketcherAttributes.id).then(
            (marvinNameSpace) => {
                marvinNameSpace.sketcherInstance.setDisplaySettings({
                    chiralFlagVisible: false
                });

                marvinNameSpace.sketcherInstance.on('molchange', () => {
                    console.log('molchange')
                });

                marvinNameSpace.onReady(() => {
                    this.marvinJSNameSpace = marvinNameSpace;
                    console.log('marvin js ready');

                    this.forceUpdate();
                });

                this.importIntoMarvinJS(this.getCurrentStarter());
                // marvinNameSpace.Sketch.license(this.licenseUrl);
            },
            (error) => {
                alert(`Cannot retrieve marvin instance from iframe:${error}`);
            }
        );
    }

    componentDidUpdate() {
        this.importIntoMarvinJS(this.getCurrentStarter());
    }

    render() {
        console.log(this.props.studyset)
        return (
            this.props.studyset ?
                <div>
                    <h3>{this.props.studyset.exercises[this.state.questionIndex].question}</h3>
                    <div className='marvin-js-wrapper'
                        ref={(element) => this.wrapper = element}>
                    </div>
                    <div style={{float: 'right', margin: 20}}>
                        <Button raise="true" color="primary" onClick={this.next}>
                        {(this.state.questionIndex < this.props.studyset.exercises.length-1) ? 'Next' : 'Finish'}
                        </Button>
                    </div>
                </div>
            : 
                <div>
                    <div>Waiting...</div>
                    <div className='marvin-js-wrapper'
                        ref={(element) => this.wrapper = element}>
                    </div>
                </div>                    
        );
    }

    


    next() {
        this.marvinJSNameSpace.sketcherInstance.exportStructure('mol').then(answer => {
            let answers = this.state.answers.concat([answer]);
            if (this.state.questionIndex === this.props.studyset.exercises.length - 1) {
                this.props.finish(answers, false, 0);
            } else {
                this.setState({
                    questionIndex: this.state.questionIndex + 1,
                    answers: answers
                });
                this.marvinJSNameSpace.sketcherInstance.clear();
            }
        });
    }

    getCurrentStarter() {
        return this.props.starter ? this.props.studyset.exercises[this.state.questionIndex].starter : null;
    }

    importIntoMarvinJS(smiles) {
        // const starter = this.props.studysets[0].exercises[this.state.questionIndex].question;
        if (smiles && this.marvinJSNameSpace) {
            axios({
                method: 'post',
                url: 'https://bioreg-demo.chemaxon.com/webservices-ws/rest-v0/util/calculate/molExport',
                data: {
                    "structure": smiles,
                    "parameters": "mol"
                }
            })
            .then(
                (response) => {
                    this.marvinJSNameSpace.sketcherInstance.importStructure('mol', response.data.structure)
                }
            )
            .catch(e => {
                console.log(e);
            })
        }
    }
}
