import React, {useContext, useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {FaPlay, FaPlus, FaCog, FaStop} from 'react-icons/fa';

import {IDEContext} from './IDEContext';
import {Script} from '../extensionReducer';
import {AddScriptDialog} from './AddScriptDialog';
import {ThemeSwitch} from './ThemeSwitch';
import {ScriptSettingDialog} from './ScriptSettingDialog';
import {ScriptSelect} from './ScriptSelect';

const CTRL_KEY = navigator.userAgent.includes('Windows') ? 'Ctrl' : '⌘';
// const SHIFT_KEY = navigator.userAgent.includes('Windows') ? 'Shift' : '⇧';

interface ActionBarProps {
  /** Execution triggerer */
  execute: () => void;
  /** Execution stop triggerer */
  stop: () => void;
  /** Puppeteer scripts */
  scripts: Script[];
  /** Current active tab */
  activeTab?: {
    /** ID of the script opened in active tab */
    scriptId: number;
  };
  /** Execution status */
  isExecuting: boolean;
}

export const ActionBar = (props: ActionBarProps) => {
  const {theme} = useContext(IDEContext);

  const [showAddScript, setShowAddScript] = useState(false);
  const openAddScriptDialog = () => setShowAddScript(true);
  const closeAddScriptDialog = () => setShowAddScript(false);

  const [scriptSetting, setScriptSetting] = useState({
    show: false,
    script: props.scripts[0],
  });
  const openScriptSettingDialog = () => {
    const script = props.scripts.find(
      script => script.id === props.activeTab?.scriptId
    );
    if (props.activeTab && script) {
      setScriptSetting({
        show: true,
        script: script,
      });
    }
  };
  const closeScriptSettingDialog = () => {
    setScriptSetting({
      ...scriptSetting,
      show: false,
    });
  };

  // register shortcuts
  useEffect(() => {
    const shortcuts = (evt: KeyboardEvent) => {
      if (evt.ctrlKey || evt.metaKey) {
        switch (evt.key) {
          case '1':
            openAddScriptDialog();
            break;

          case '2':
            props.isExecuting ? props.stop() : props.execute();
            break;

          case '3':
            openScriptSettingDialog();
            break;
        }
      }
    };
    document.addEventListener('keydown', shortcuts);
    return () => document.removeEventListener('keydown', shortcuts);
  }, [props]);

  const NavLinkWrapper = (props: {
    children: (JSX.Element | string)[];
    title: JSX.Element | string;
  }) => {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{props.title}</Tooltip>}
      >
        <Nav.Link className="d-flex justify-content-around align-items-center">
          {props.children}
        </Nav.Link>
      </OverlayTrigger>
    );
  };

  return (
    <Navbar
      variant={theme}
      className={`pt-0 pb-0 ${
        theme === 'dark' ? 'action-bar-dark' : 'action-bar-light'
      }`}
    >
      <Container fluid>
        <Nav>
          <Nav.Item onClick={openAddScriptDialog}>
            <NavLinkWrapper title={<kbd>{`${CTRL_KEY}+1`}</kbd>}>
              <FaPlus className="me-1" /> New Script
            </NavLinkWrapper>
          </Nav.Item>
          {props.activeTab ? (
            <>
              {props.isExecuting ? (
                <Nav.Item onClick={props.stop}>
                  <NavLinkWrapper title={<kbd>{`${CTRL_KEY}+2`}</kbd>}>
                    <FaStop className="me-1" /> Stop
                  </NavLinkWrapper>
                </Nav.Item>
              ) : (
                <Nav.Item onClick={props.execute}>
                  <NavLinkWrapper title={<kbd>{`${CTRL_KEY}+2`}</kbd>}>
                    <FaPlay className="me-1" /> Execute
                  </NavLinkWrapper>
                </Nav.Item>
              )}
            </>
          ) : null}
        </Nav>
        <Nav className="w-75 d-flex justify-content-end align-items-center">
          {props.activeTab ? (
            <Nav.Item className="me-2" onClick={openScriptSettingDialog}>
              <NavLinkWrapper title={<kbd>{`${CTRL_KEY}+3`}</kbd>}>
                <FaCog className="me-1" /> Script Setting
              </NavLinkWrapper>
            </Nav.Item>
          ) : null}
          <Nav.Item className="me-2">
            <ScriptSelect activeTab={props.activeTab} scripts={props.scripts} />
          </Nav.Item>
          <Nav.Item className="me-2">
            <ThemeSwitch />
          </Nav.Item>
        </Nav>
      </Container>
      <AddScriptDialog
        show={showAddScript}
        closeDialog={closeAddScriptDialog}
      />
      {scriptSetting.script ? (
        <ScriptSettingDialog
          show={scriptSetting.show}
          script={scriptSetting.script}
          closeDialog={closeScriptSettingDialog}
        />
      ) : null}
    </Navbar>
  );
};
