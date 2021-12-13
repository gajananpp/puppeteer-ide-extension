import React from 'react';
import {FaPlay, FaStop} from 'react-icons/fa';

interface ActionBarProps {
  /** ActionBar theme */
  theme?: 'light' | 'dark';
  /** current state of execution */
  isExecuting: boolean;
  /** execute button click handler */
  execute: () => void;
  /** stop button click handler */
  stop: () => void;
}

/**
 * Top bar containing action button
 * @param props - {@link ActionBarProps}
 * @returns ActionBar component
 */
export const ActionBar = (props: ActionBarProps) => {
  return (
    <div id="action-bar" className={props.theme === 'dark' ? 'dark' : ''}>
      {!props.isExecuting ? (
        <span onClick={props.execute}>
          <FaPlay style={{marginRight: 5}} /> Execute
        </span>
      ) : (
        <span onClick={props.stop}>
          <FaStop style={{marginRight: 5}} /> Stop
        </span>
      )}
    </div>
  );
};
