import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';


export default class Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {marvinJSNameSpace: null};
    }

    componentDidMount() {
        let sketcherAttributes = {
            id: 2,
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
                    this.setState({marvinJSNameSpace: marvinNameSpace});
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
        const image = this.state.marvinJSNameSpace ? this.createExporter().render(`
        Mrv17f0 11031716102D          
      
        1  0  0  0  0  0            999 V2000
         -1.0045    0.4911    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
      M  END`) : null;

        return (
            <div>
                <div ref={(element) => this.wrapper = element}></div>
                <Table>
                    <TableBody>
                        {this.props.answers.map((answer, index) => (
                            <TableRow>
                                <TableCell>{this.props.questions[index]}</TableCell>
                                <TableCell>{image}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> 
            </div>
        )
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
                'imageType': 'svg', // type of output image
                'inputFormat': 'smiles' // renderer will expect molecule source in this format
                // 'services': services // to resolve any molecule format and be able to calculate stereo info
        }
        return new this.state.marvinJSNameSpace.ImageExporter(params);
    }
};
