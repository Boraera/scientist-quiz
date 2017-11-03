import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import axios from 'axios';


export default class Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: null
        };
    }

    componentDidMount() {
        let sketcherAttributes = {
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
                        {this.props.answers.map((answer, index) => (
                            <TableRow>
                                <TableCell>{this.props.questions[index]}</TableCell>
                                <TableCell>{this.state.actualAnswerImages ? <div dangerouslySetInnerHTML={{__html: this.state.actualAnswerImages[index]}}></div> : null}</TableCell>
                                <TableCell>{this.state.expectedAnswerImages ? <div dangerouslySetInnerHTML={{__html: this.state.expectedAnswerImages[index]}}></div> : null}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    createActualAnswerList() {
        if (!this.props.actualAnswers) {
            return; null;
        }

        const promises = this.props.actualAnswers.map((answer, index) => {
            return axios({
                method: 'post',
                url: 'https://bioreg-demo.chemaxon.com/webservices-ws/rest-v0/util/calculate/molExport',
                data: {
                    "structure": answer,
                    "parameters": "mol"
                }
            })
            .then(
                (response) => {
                    return response.data.structure;
                }
            )
            .then((mol) => {
                return this.createExporter().render(mol)
            })

        });

        Promise.all(promises)
        .then(values => {
            this.setState({actualAnswerImages: values});
        })
        .catch(e => console.log(e));
    }

    createExpectedAnswerList() {
        const promises = this.props.answers.map((answer, index) => {
            return axios({
                method: 'post',
                url: 'https://bioreg-demo.chemaxon.com/webservices-ws/rest-v0/util/calculate/molExport',
                data: {
                    "structure": answer,
                    "parameters": "mol"
                }
            })
            .then(
                (response) => {
                    return response.data.structure;
                }
            )
            .then((mol) => {
                return this.createExporter().render(mol)
            })

        });

        Promise.all(promises)
        .then(values => {
            this.setState({expectedAnswerImages: values});
        })
        .catch(e => console.log(e));
    }

    createExporter() {
        // var inputFormat = $("input[type='radio'][name='inputFormat']:checked").val();
        // if(inputFormat == "") {
        //     inputFormat = null;
        // }
        // var defaultServices = getDefaultServices();
        // var services = {};
        // services['molconvertws'] = defaultServices['molconvertws'];
        // if($('#chbx-calcStereo').is(":checked")) {
        //     services['stereoinfows'] = defaultServices['stereoinfows']; // enable stereo calculation
        // }
        var params = {
                'imageType': 'image/svg', // type of output image
                'inputFormat': 'mol' // renderer will expect molecule source in this format
                // 'services': services // to resolve any molecule format and be able to calculate stereo info
        }
        return new this.marvinJSNameSpace.ImageExporter(params);
    }
};
