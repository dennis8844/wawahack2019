import React from 'react';
import PropTypes from 'prop-types';
import { ModalConsumer } from './ModalContext';

const ModalRoot = () => (
    <ModalConsumer>
        {({ component: Component, componentType, open, showModal, hideModal, actionButtonText,
              onAction, cancelButtonText, completionMessage, onUndo, props }) =>
            Component ? <Component open={open}
                                   showModal={showModal}
                                   hideModal={hideModal}
                                   componentType={componentType}
                                   actionButtonText={actionButtonText}
                                   onAction={onAction}
                                   cancelButtonText={cancelButtonText}
                                   completionMessage={completionMessage}
                                   onUndo={onUndo}
                                   {...props}
            /> : null
        }
    </ModalConsumer>
);

ModalRoot.propTypes = {
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    componentType: PropTypes.string.isRequired,
    actionButtonText: PropTypes.string,
    onAction: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string,
    onUndo: PropTypes.func,
    open: PropTypes.bool,
    completionMessage: PropTypes.string
};

export default ModalRoot;



//https://medium.com/@BogdanSoare/how-to-use-reacts-new-context-api-to-easily-manage-modals-2ae45c7def81