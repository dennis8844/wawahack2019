import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import QRCode from 'qrcode.react';
import GridContainer from "../Grid/GridContainer";
import GridItem from "../Grid/GridItem";
import Button from '@material-ui/core/Button';
import rawKiosk from "../../utils/kiosk.json";
import AddIcon from '@material-ui/icons/Add';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

class QRreader extends Component {
    constructor(props){
        super(props)
        this.state = {
            delay: 300,
            result: '',
            scanned: false,
            activated: false,
            addMode: 'all'
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

    setAddMode(e) {
        if (e) {
            this.setState({ addMode : this.state.addMode === 'all' ? 'single' : 'all' });
        }
    }

    render(){
        console.log(this.props);
        const kioskData = JSON.stringify(rawKiosk);
        const previewStyle = {
            height: 240,
            width: 240,
            margin: this.props.source === 'receipt' ? 'auto' : ''
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
                        <GridItem style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <Button variant="contained" size="large" variant="contained" size="large"
                                    onClick={(e) => {this.setAddMode(e)}} >
                                {this.state.addMode === 'all' ? <AddIcon /> : <SmartphoneIcon />}
                                <div>{this.state.addMode === 'all' ? 'Add Item from App' : 'View Your Items Here'}</div>
                            </Button>
                            {this.state.addMode === 'all' ? <QRCode value={kioskData} style={previewStyle}/> :
                                <QrReader
                                    delay={this.state.delay}
                                    style={previewStyle}
                                    onError={this.handleError}
                                    onScan={this.handleScan}
                                />
                            }
                        </GridItem>
                    }
                </GridContainer>
            </div>
        )
    }
}

export default QRreader;