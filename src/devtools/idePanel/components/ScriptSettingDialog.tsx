import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {FaTrashAlt} from 'react-icons/fa';

import {IDEContext} from './IDEContext';
import {Script} from '../extensionReducer';

interface ScriptSettingDialogProps {
  script: Script;
  show: boolean;
  closeDialog: () => void;
}

export const ScriptSettingDialog = (props: ScriptSettingDialogProps) => {
  const {theme, dispatch} = useContext(IDEContext);

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
        <Modal.Title>Script Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Script Name"
            defaultValue={props.script.name}
            onChange={evt =>
              dispatch({
                type: 'renameScript',
                id: props.script.id,
                name: evt.target.value,
              })
            }
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="d-flex justify-content-around align-items-center"
          variant="danger"
          onClick={() => {
            dispatch({
              type: 'removeScript',
              id: props.script.id,
            });
            props.closeDialog();
          }}
        >
          <FaTrashAlt className="me-1" /> Delete Script
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
