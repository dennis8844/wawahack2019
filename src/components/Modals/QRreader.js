import React, { Component } from 'react';
import QrReader from 'react-qr-reader';


class QRreader extends Component {
    constructor(props){
        super(props)
        this.state = {
            delay: 300,
            result: '',
            addMode: 'all'
        }
    }

    handleScan = (result) => {
        if(result){
            console.log(result);
            const qrData = {
                nextContent: 'personalItems',
                fromQR: true,
                source: this.props.source
            };
            const e = {};

            this.props.updateContent(qrData);
        }
    }

    clickQR = () => {
        const qrData = {
            nextContent: 'personalItems',
            fromQR: true,
            source: this.props.source
        };
        const e = {};

        this.props.updateContent(qrData);
    }



    setAddMode = (e) => {
        if (e) {
            this.setState({ addMode : this.state.addMode === 'all' ? 'single' : 'all' });
        }
    }

    render(){
        console.log(this.props);





        return(

        )
    }
}

export default QRreader;