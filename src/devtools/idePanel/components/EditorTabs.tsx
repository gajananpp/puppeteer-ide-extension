import React, {useContext, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import * as monaco from 'monaco-editor';
import Container from 'react-bootstrap/Container';
import {FaTimes} from 'react-icons/fa';

import {IDEContext} from './IDEContext';
import {Script} from '../extensionReducer';

export interface EditorTabsProps {
  /** Tabs in editor */
  tabs: {
    /** ID of the script opened in given tab */
    scriptId: number;
    /** Script's model */
    model: monaco.editor.ITextModel;
  }[];
  /** Helper to get script by id from stored scripts */
  getScriptById: (scriptId: number) => Script | undefined;
  /** Index of the active tab */
  activeTab: number;
}

export const EditorTabs = (props: EditorTabsProps) => {
  const {dispatch, theme} = useContext(IDEContext);

  const TabTitle = (tabTitleProps: {children: string; eventKey: number}) => {
    const isActive = props.activeTab === tabTitleProps.eventKey;
    const [closeIconStyle, setCloseIconStyle] = useState({
      display: isActive ? 'inline' : 'none',
    });

    return (
      <Nav.Link
        onMouseEnter={() => setCloseIconStyle({display: 'inline'})}
        onMouseLeave={() => {
          if (!isActive) setCloseIconStyle({display: 'none'});
        }}
        className="ps-0 pe-0"
        eventKey={tabTitleProps.eventKey}
      >
        <Container
          fluid
          className={'d-flex justify-content-between align-items-center'}
        >
          <span className="d-inline-block text-truncate">
            {tabTitleProps.children}
          </span>
          <span
            style={closeIconStyle}
            onClick={evt => {
              evt.stopPropagation();
              dispatch({
                type: 'removeTab',
                tabNumber: tabTitleProps.eventKey,
              });
            }}
          >
            <FaTimes />
          </span>
        </Container>
      </Nav.Link>
    );
  };

  return (
    <Nav
      className={`${
        theme === 'dark' ? 'tab-bar-dark' : 'tab-bar-light'
      } border-0 d-flex flex-nowrap overflow-auto`}
      activeKey={props.activeTab}
      variant="tabs"
      onSelect={eventKey =>
        dispatch({
          type: 'switchTab',
          tabNumber: typeof eventKey === 'string' ? parseInt(eventKey) : 0,
        })
      }
    >
      {props.tabs.map((tab, idx) => (
        <Nav.Item key={idx} style={{width: '10rem'}}>
          <TabTitle eventKey={idx}>
            {props.getScriptById(tab.scriptId)?.name || 'anonymous'}
          </TabTitle>
        </Nav.Item>
      ))}
    </Nav>
  );
};
