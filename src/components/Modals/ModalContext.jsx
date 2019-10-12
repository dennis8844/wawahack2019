import React, { Component, createContext } from 'react';

const ModalContext = createContext({
    component: null,
    open: true,
    showModal: () => {},
    hideModal: () => {}
});

export class ModalProvider extends Component {

    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            component: null,
            open: true,
            props: {},
            showModal: this.showModal,
            hideModal: this.hideModal
        };
    }

    componentDidMount = () => {
        //this.setState({ open: this.props.open})
    }

    showModal = (component) => {

        this.setState({
            component
        });
    };

    hideModal = () => {
        this.setState({
            component: null
        });
    }

    render() {
        return (
            <ModalContext.Provider value={this.state}>
                {this.props.children}
            </ModalContext.Provider>
        );
    }
}

export const ModalConsumer = ModalContext.Consumer;
