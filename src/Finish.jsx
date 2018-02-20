import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import axios from 'axios';
import Button from 'material-ui/Button';
require('./Finish.scss');

export default class Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: null,
            actualStructures: null,
            actualAnswerImages: null,
            expectedAnswerImages: null,
            isCorrectStructure: null
        };
        this.isCorrect = this.isCorrect.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.next = this.next.bind(this); 
    }

    componentDidMount() {
        const sketcherAttributes = {
            id: 2,
            src: 'marvinjs/editor.html',
            name: 'marvin-hidden',
            'data-toolbars': 'markush'
        };

        const container = ReactDom.findDOMNode(this.wrapper);
        $(container).append($('<iframe>', sketcherAttributes));

        MarvinJSUtil.getPackage('#' + sketcherAttributes.id).then(
            (marvinNameSpace) => {
                marvinNameSpace.sketcherInstance.setDisplaySettings({
                    chiralFlagVisible: false
                });

                marvinNameSpace.onReady(() => {
                    this.marvinJSNameSpace = marvinNameSpace;
                    this.createExpectedAnswerList();
                    this.createActualAnswerList();
                });
            },
            (error) => {
                alert(`Cannot retrieve marvin instance from iframe:${error}`);
            }
        );
    }

    render() {
        return (
            <div>
                <div ref={(element) => this.wrapper = element}></div>
                <h3>{this.props.title}</h3>
                { this.props.submitted ? <h4>Result score: {this.calculateScore()} / {this.props.exercises.length}</h4> : null }
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Your answer</TableCell>
                            <TableCell>{this.props.submitted ? "Correct answer" : null}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.exercises.map((exercise, index) => (
                            <TableRow key={index} className={this.calculateColor(index)}>
                                <TableCell>{exercise.question}</TableCell>
                                <TableCell>{this.state.actualAnswerImages  ? <div dangerouslySetInnerHTML={{__html: this.state.actualAnswerImages[index]}}></div> : null}</TableCell>
                                <TableCell>
                                    {this.state.expectedAnswerImages && this.props.submitted ? <div dangerouslySetInnerHTML={{__html: this.state.expectedAnswerImages[index]}}></div> : null} 
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                this.props.submitted ? null :
                <div style={{float: 'right', margin: 20}}>
                        <Button raised color="primary" onClick={this.next}>Submit
                    </Button>
                </div>
                }
            </div>
        )
    }

    async next() {
        var index;
        var promises = [];
        for(index=0; index < this.props.exercises.length; index++){
            const response = this.isCorrect(index);
            console.log("isCorrect promise:", response);
            response.then(function (value)  {
                console.log("isCorrect value:", value);
            });
            promises[index] = response;

        }
        const values = await Promise.all(promises);
        this.setState({isCorrectStructure: values});
        this.props.finish(this.props.actualAnswers, true, this.calculateScore(), values);
    }

    async isCorrect(index) {  
        const response =await axios({
            method: 'post',
            url: '/checker',
            data: {
                "queryStructure": this.state.actualStructures[index],
                "targetStructure": this.props.exercises[index].answer, 
                "searchType": "duplicate" 
            }
        })
        return response.data.duplicate;
    }

    calculateColor(index){
        if ( this.props.submitted ){
            if ( this.state.isCorrectStructure ){
                return this.state.isCorrectStructure[index]==="true" ? 'row-correct' : 'row-incorrect';
            }
        } else{
            return 'row-basic';
        }
    }
      

    calculateScore(){
        var i;
        var score =0;
        if ( this.state.actualStructures  ){
            for (i = 0; i < this.state.actualStructures.length; i++) {
                if (this.state.isCorrectStructure[i]==="true") { 
                    score++;
                }
            }
        }
        return score;
    }

    async saveActualStructuresToSmiles(answer) {
        const response = await axios({
            method: 'post',
            url: 'https://bioreg-demo.chemaxon.com/webservices-ws/rest-v0/util/calculate/molExport',
            data: {
                "structure": answer,
                "parameters": "cxsmiles:u-e"
            }
        })
        return (response.data.structure);
    }

    async createActualAnswerList() {
        const images = this.props.actualAnswers.map(answer => this.createExporter().render(answer));
        const structures = this.props.actualAnswers.map(this.saveActualStructuresToSmiles);

        try {
            const actualAnswerImages = await Promise.all(images);
            const actualStructures = await Promise.all(structures);
            this.setState({actualAnswerImages, actualStructures});
        } catch(e) {console.log(e)}
    }

    async convertAnswers(excercise, saveStructure) {
        const response = await axios({
            method: 'post',
            url: 'https://bioreg-demo.chemaxon.com/webservices-ws/rest-v0/util/calculate/molExport',
            data: {
                "structure": excercise.answer,
                "parameters": "mol"
            }
        });
        saveStructure(response.data.structure);
        return this.createExporter().render(response.data.structure);
    }

    async createExpectedAnswerList() {
        try {
            const promises = this.props.exercises.map(excercise => this.convertAnswers(excercise, () => {}));
            const values = await Promise.all(promises);
            this.setState({expectedAnswerImages: values});
        } catch(e) {console.log(e)}
    }

    createExporter() {
        var params = {
            'imageType': 'image/svg', // type of output image
            'inputFormat': 'mol' // renderer will expect molecule source in this format
        }
        return new this.marvinJSNameSpace.ImageExporter(params);
    }
};

Finish.propTypes = {
    exercises: PropTypes.arrayOf(PropTypes.shape({
        answer: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired
    }).isRequired).isRequired,
    actualAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
    submitted: PropTypes.bool.isRequired,
    title: PropTypes.string
}
