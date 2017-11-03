import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
require('./marvinjs_launcher');
import Promise from 'es6-promise';

export default class Home extends React.Component {
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
                <div>Title</div>
                <div
                    style={{
                        width: '500px',
                        height: '500px'
                    }}
                    ref={(element) => this.wrapper = element}>
                </div>
            </div>
        )
    }
}