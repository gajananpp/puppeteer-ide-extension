import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import {initialScript} from '../idePanel';
import {IDEContext} from './IDEContext';

interface AddScriptDialogProps {
  show: boolean;
  closeDialog: () => void;
}

export const AddScriptDialog = (props: AddScriptDialogProps) => {
  const [scriptTitle, setScriptTitle] = useState('');

  const {dispatch, theme} = useContext(IDEContext);

  return (
    <Modal
      contentClassName={`${theme === 'dark' ? 'modal-dark' : 'modal-light'}`}
      animation={false}
      show={props.show}
      onHide={props.closeDialog}
    >
      <Modal.Header
        closeButton
        closeVariant={theme === 'dark' ? 'white' : undefined}
      >
        <Modal.Title>Add Script</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="add-script-modal">
          <Form.Control
            autoFocus
            type="text"
            placeholder="Script Name"
            onChange={evt => setScriptTitle(evt.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.closeDialog}>
          Cancel
        </Button>
        <Button
          form="add-script-modal"
          type="submit"
          variant="primary"
          onClick={() => {
            const script = {
              name: scriptTitle.trim().length ? scriptTitle : 'anonymous',
              value: initialScript,
            };
            dispatch({
              type: 'addScript',
              script: script,
            });
            props.closeDialog();
          }}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
