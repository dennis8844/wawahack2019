import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ContactUs from 'components/ContactForm/ContactForm.js'
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import ModalRoot from "./ModalRoot";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};

function ModalDialog(props) {
    console.log(props);
    const { snackbar, open, classes, hideModal, showModal, componentType, actionButtonText,
        onAction, cancelButtonText, completionMessage, onUndo } = props,
        hasActionButtonText = actionButtonText && actionButtonText.length > 0,
        hasCancelButtonText = cancelButtonText && cancelButtonText.length > 0,
        hasCompletionMessage = completionMessage && completionMessage.length > 0;


    function onExecute (firstFunction) {
        firstFunction();
        snackbar.showMessage(completionMessage, onUndo);
    }

    switch (componentType) {
        case 'contact':
            return (

                <Dialog
                    open={open}
                    onClose={hideModal}
                    onOpen={showModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Send Us a Message</DialogTitle>
                    <DialogContent>
                        <ContactUs isModal
                                   onExecute={onExecute}
                                   hasActionButtonText={hasActionButtonText}
                                   hasCancelButtonText={hasCancelButtonText}
                                   {...props}/>
                    </DialogContent>
                </Dialog>
            );
            break;
        case 'signup':
            return (
                <Dialog
                    open={open}
                    onClose={hideModal}
                    onOpen={showModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Send Us a Message</DialogTitle>
                    <DialogContent>
                        <ContactUs isModal
                                   onExecute={onExecute}
                                   hasActionButtonText={hasActionButtonText}
                                   hasCancelButtonText={hasCancelButtonText}
                                   {...props}/>
                    </DialogContent>
                </Dialog>
            );
            break;
        case 'login':
            return (null);
            break;
        default:
            return (null);
            break;
    }
}

ModalDialog.propTypes = {
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    componentType: PropTypes.string.isRequired,
    componentTitle: PropTypes.string,
    actionButtonText: PropTypes.string,
    onAction: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string,
    onUndo: PropTypes.func,
    open: PropTypes.bool,
    completionMessage: PropTypes.string
};

export default withStyles(styles)(ModalDialog);

