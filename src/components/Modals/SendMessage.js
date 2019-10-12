import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useSnackbar } from 'material-ui-snackbar-provider';
import { sendMessageInfo } from 'utils/variables/sharedData.js';
import { emailValidations, userNameValidations, messageValidations, validateInput } from "utils/validations.js";

import workStyles from "assets/jss/material-kit-react/views/landingPageSections/workStyle.js";

import SectionStyles from "assets/jss/material-kit-react/views/aboutPageSections/contactUsStyle.js";
import ModalStyles from "assets/jss/material-kit-react/components/sendMessageStyle.js";

const messageSectionStyles = makeStyles(SectionStyles);
const messageModalStyles = makeStyles(ModalStyles);

function SendMessage(props) {
    const { parentType, onClose } = props;
    const isModal = parentType === 'modal';
    const [isSending, setIsSending] = React.useState(false);
    const [name, setName] = React.useState('');
    const [nameTouched, setNameTouched] = React.useState(false);
    const [nameValid, setNameValid] = React.useState(false);
    const [nameError, setNameError] = React.useState('');
    const nameReady = nameTouched && nameValid;
    const [email, setEmail] = React.useState('');
    const [emailTouched, setEmailTouched] = React.useState(false);
    const [emailValid, setEmailValid] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const emailReady = emailTouched && emailValid;
    const [message, setMessage] = React.useState('');
    const [messageTouched, setMessageTouched] = React.useState(false);
    const [messageValid, setMessageValid] = React.useState(false);
    const [messageError, setMessageError] = React.useState('');
    const messageReady = messageTouched && messageValid;
    const sendEnabled = nameReady && emailReady && messageReady;
    const classes = isModal ? messageModalStyles() : messageSectionStyles();
    const snackbar = useSnackbar();

    const clearInputs = (e) => {
        if (e) {
            setIsSending(false);
            setName('');
            setNameTouched(false);
            setNameValid(false);
            setNameError('');
            setEmail('');
            setEmailTouched(false);
            setEmailValid(false);
            setEmailError('');
            setMessage('');
            setMessageTouched(false);
            setMessageValid(false);
            setMessageError('');
        }
    }

    const closeModal = (e) => {
        if (e && isModal) {
            console.log('cancel clicked')
            onClose(e);
        }
    }

    const handleName = (e) => {
        if (e) {
            const newValue = e.target.value;
            if (!nameTouched) {
                setNameTouched(true);
            }
            const validationResults = validateInput(newValue, userNameValidations);
            setName(validationResults.value);
            setNameValid(validationResults.isValid);
            setNameError(validationResults.error);
        }
    }

    const handleEmail = (e) => {
        if (e) {
            const newValue = e.target.value;
            if (!emailTouched) {
                setEmailTouched(true);
            }
            const validationResults = validateInput(newValue, emailValidations);
            setEmail(validationResults.value);
            setEmailValid(validationResults.isValid);
            setEmailError(validationResults.error);
        }
    }

    const handleMessage = (e) => {
        if (e) {
            const newValue = e.target.value;
            if (!messageTouched) {
                setMessageTouched(true);
            }
            const validationResults = validateInput(newValue, messageValidations);
            setMessage(validationResults.value);
            setMessageValid(validationResults.isValid);
            setMessageError(validationResults.error);
        }
    }

    const sendMessage = (e) => {
        if (e) {
            setIsSending(true);
            //do magic here & get response
            if (isModal) {
                closeModal(e);
            } else {
                clearInputs(e);
            }
            snackbar.showMessage(
                'Your message has been sent!'
            )
        }
    }




    return (
        <div onClick={(e) => {onClose(e)}}>
            <div className={isModal ? classes.container : classes.section}>
            <GridContainer justify="center">
                <GridItem cs={12} sm={12} md={8}>
                    <Card onClick={(e) => {e.stopPropagation()}}>

                        <h3 className={classes.title}>{isModal ? sendMessageInfo.modalTitle : sendMessageInfo.sectionTitle}</h3>
                        {!isModal && <h5 className={classes.description}>{sendMessageInfo.subTitle}</h5>}
                        <form>
                            <CardContent>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Your Name"
                                            id="name"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleName()
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Your Email"
                                            id="email"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleEmail()
                                            }}
                                        />
                                    </GridItem>
                                    <CustomInput
                                        labelText="Your Message"
                                        id="message"
                                        formControlProps={{
                                            fullWidth: true,
                                            className: classes.textArea
                                        }}
                                        inputProps={{
                                            multiline: true,
                                            rows: 5,
                                            onChange: handleMessage()
                                        }}
                                    />
                                </GridContainer>
                            </CardContent>
                            <CardActions>
                                {isModal && <Button color="primary" simple onClick={(e) => {closeModal(e)}}>Cancel</Button>}
                                {isModal && <span></span>}
                                <Button simple color="primary" onClick={(e) => {clearInputs(e)}}>Clear</Button>
                                <Button color="primary" onClick={(e) => {sendMessage(e)}}>Send Message</Button>
                            </CardActions>
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
        </div>

    );
}

SendMessage.propTypes = {
    onClose: PropTypes.func, //close function for modal
    parentType: PropTypes.string.isRequired //modal or section
};

export default SendMessage;

