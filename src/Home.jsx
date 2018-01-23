import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
require('./marvinjs_launcher');
require('./Home.scss');
import Promise from 'es6-promise';
import Button from 'material-ui/Button';

export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            questionIndex: 0,
            answers: []
        };
        this.next = this.next.bind(this);
        
    }

    componentDidMount() {
        let sketcherAttributes = {
            id: 1,
            src: 'marvinjs/editor.html',
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
                });
                // marvinNameSpace.Sketch.license(this.licenseUrl);
            },
            (error) => {
                alert(`Cannot retrieve marvin instance from iframe:${error}`);
            }
        );
    }

    render() {
        //console.log(this.props.studysets)
        return (
            this.props.studysets.length > 0 ?  
                <div>
                    <h3>{this.props.studysets[0].exercises[this.state.questionIndex].question}</h3>
                    <div className='marvin-js-wrapper'
                        ref={(element) => this.wrapper = element}>
                    </div>
                    <div style={{float: 'right', margin: 20}}>
                        <Button raised color="primary" onClick={this.next}>
                        {(this.state.questionIndex < this.props.studysets[0].exercises.length-1) ? 'Next' : 'Submit'}
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
            if (this.state.questionIndex === this.props.studysets[0].exercises.length - 1) {
                this.props.finish(answers);
            } else {
                this.setState({
                    questionIndex: this.state.questionIndex + 1,
                    answers: answers
                });
                this.marvinJSNameSpace.sketcherInstance.clear();
            }
        });
    }
}
