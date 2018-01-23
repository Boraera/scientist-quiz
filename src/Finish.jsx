import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import axios from 'axios';
require('./Finish.scss');

export default class Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: null,
            actualStructures: null,
            actualAnswerImages: null,
            expectedAnswerImages: null
        };
        this.isCorrect = this.isCorrect.bind(this);
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Your answer</TableCell>
                            <TableCell>Correct answer</TableCell>
                            <TableCell>Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.exercises.map((exercise, index) => (
                            <TableRow key={index} className={this.isCorrect(index) ? 'row-correct' : 'row-incorrect'}>
                                <TableCell>{exercise.question}</TableCell>
                                <TableCell>{this.state.actualAnswerImages  ? <div dangerouslySetInnerHTML={{__html: this.state.actualAnswerImages[index]}}></div> : null}</TableCell>
                                <TableCell>{this.state.expectedAnswerImages ? <div dangerouslySetInnerHTML={{__html: this.state.expectedAnswerImages[index]}}></div> : null}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    isCorrect(index) {
        return this.state.actualStructures && this.state.actualStructures[index] === this.props.exercises[index].answer;
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
    actualAnswers: PropTypes.arrayOf(PropTypes.string).isRequired
}
