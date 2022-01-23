import React, {useContext, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import NavBar from 'react-bootstrap/NavBar';
import Container from 'react-bootstrap/Container';
import {FaPlay, FaPlus, FaCog, FaStop} from 'react-icons/fa';

import {IDEContext} from './IDEContext';
import {Script} from '../extensionReducer';
import {AddScriptDialog} from './AddScriptDialog';
import {ThemeSwitch} from './ThemeSwitch';
import {ScriptSettingDialog} from './ScriptSettingDialog';
import {ScriptSelect} from './ScriptSelect';

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
    setScriptSetting({
      ...scriptSetting,
      show: true,
    });
  };
  const closeScriptSettingDialog = () => {
    setScriptSetting({
      ...scriptSetting,
      show: false,
    });
  };

  const NavLinkWrapper = (props: {children: (JSX.Element | string)[]}) => {
    return (
      <Nav.Link className="d-flex justify-content-around align-items-center">
        {props.children}
      </Nav.Link>
    );
  };

  return (
    <NavBar
      variant={theme}
      className={`pt-0 pb-0 ${
        theme === 'dark' ? 'action-bar-dark' : 'action-bar-light'
      }`}
    >
      <Container fluid>
        <Nav>
          <Nav.Item onClick={openAddScriptDialog}>
            <NavLinkWrapper>
              <FaPlus className="me-1" /> New Script
            </NavLinkWrapper>
          </Nav.Item>
          {props.activeTab ? (
            <>
              {props.isExecuting ? (
                <Nav.Item onClick={props.stop}>
                  <NavLinkWrapper>
                    <FaStop className="me-1" /> Stop
                  </NavLinkWrapper>
                </Nav.Item>
              ) : (
                <Nav.Item onClick={props.execute}>
                  <NavLinkWrapper>
                    <FaPlay className="me-1" /> Execute
                  </NavLinkWrapper>
                </Nav.Item>
              )}
            </>
          ) : null}
        </Nav>
        <Nav className="w-75 d-flex justify-content-end align-items-center">
          {props.activeTab ? (
            <Nav.Item
              className="me-2"
              onClick={() => {
                const script = props.scripts.find(
                  script => script.id === props.activeTab?.scriptId
                );
                if (props.activeTab && script) {
                  setScriptSetting({
                    show: true,
                    script: script,
                  });
                }
              }}
            >
              <NavLinkWrapper>
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
        openDialog={openAddScriptDialog}
        closeDialog={closeAddScriptDialog}
      />
      {scriptSetting.script ? (
        <ScriptSettingDialog
          show={scriptSetting.show}
          script={scriptSetting.script}
          openDialog={openScriptSettingDialog}
          closeDialog={closeScriptSettingDialog}
        />
      ) : null}
    </NavBar>
  );
};
