import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import {FaSun, FaMoon} from 'react-icons/fa';

import {IDEContext} from './IDEContext';

export const ThemeSwitch = () => {
  const {theme, dispatch} = useContext(IDEContext);

  return (
    <>
      <span className="me-2">
        <FaMoon />
      </span>{' '}
      <Form.Check
        className="me-0"
        inline
        checked={theme === 'light'}
        onChange={evt => {
          const theme = evt.target.checked ? 'light' : 'dark';
          dispatch({
            type: 'switchTheme',
            theme: theme,
          });
        }}
        type="switch"
        id="theme-switch"
      />{' '}
      <span>
        <FaSun />
      </span>
    </>
  );
};
