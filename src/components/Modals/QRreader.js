import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import QRCode from 'qrcode.react';
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import rawKiosk from "../../utils/kiosk.json";

class QRreader extends Component {
    constructor(props){
        super(props)
        this.state = {
            delay: 300,
            result: '',
            scanned: false,
            activated: false
        }

        this.handleScan = this.handleScan.bind(this)
    }
    handleScan(result){
        if(result){
            this.setState({ result: 'Success', scanned: true }, () => {
                this.props.updateContent('personalItems', 'fromQR', this.props.source);
            });
        }
    }
    handleError(err){
        console.error(err)
    }
    render(){
        console.log(this.props);
        const kioskData = JSON.stringify(rawKiosk);
        const previewStyle = {
            height: 320,
            width: 320,
            margin: 'auto'
        }

        const titleText = this.props.source === 'receipt' ? 'Scan from a reciept' : 'Scan the QR in your app';

        return(
            <div>
                <h1 style={{color: '#a93337'}}>{titleText}</h1>
                <h3>To Quickly Add Your Items</h3>
                <GridContainer direction='row' justify="center">
                    {this.props.source === 'receipt' || this.state.activated ?
                    <GridItem style={{display: 'flex', flexDirection: 'column'}}>
                        <QrReader
                            delay={this.state.delay}
                            style={previewStyle}
                            onError={this.handleError}
                            onScan={this.handleScan}
                        />
                        <p>{this.state.result && this.state.result}</p>
                    </GridItem> :
                        <GridItem style={{display: 'flex', flexDirection: 'column'}}>
                            <QRCode value={kioskData} style={previewStyle} />
                        </GridItem>
                    }
                </GridContainer>
            </div>
        )
    }
}

export default QRreader;