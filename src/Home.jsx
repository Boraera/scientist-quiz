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
                    console.log('marvinjs ready')
                });
                // marvinNameSpace.Sketch.license(this.licenseUrl);
            },
            (error) => {
                alert(`Cannot retrieve marvin instance from iframe:${error}`);
            }
        );
    }

    render() {
        return (
            <div>
                <h3>{this.props.questions[this.state.questionIndex]}</h3>
                <div className='marvin-js-wrapper'
                    ref={(element) => this.wrapper = element}>
                </div>
                <div style={{float: 'right', margin: 20}}>
                    <Button raised color="primary" onClick={this.next.bind(this)}>Next</Button>
                </div>
            </div>
        );
    }

    next() {
        this.marvinJSNameSpace.sketcherInstance.exportStructure('mol').then(answer => {
            let answers = this.state.answers.concat([answer]);
            if (this.state.questionIndex === this.props.questions.length - 1) {
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
