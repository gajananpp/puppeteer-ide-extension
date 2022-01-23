import React, {useContext} from 'react';
import Select, {StylesConfig} from 'react-select';
import {Script} from '../extensionReducer';
import {IDEContext} from './IDEContext';

interface ScriptSelectProps {
  scripts: Script[];
  activeTab?: {
    scriptId: number;
  };
}

interface Option {
  label: string;
  value: number;
  id: number;
}

export const ScriptSelect = (props: ScriptSelectProps) => {
  const {theme, dispatch} = useContext(IDEContext);

  const bgColor = theme === 'light' ? '#ffffff' : '#3c3c3c';
  const fontColor = theme === 'light' ? '#767676' : '#8d8d8e';
  const inputFontColor = theme === 'light' ? '#616161' : '#cccccc';

  const selectStyles: StylesConfig = {
    control: provided => ({
      ...provided,
      backgroundColor: bgColor,
      borderColor: bgColor,
    }),
    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: fontColor,
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: fontColor,
    }),
    input: provided => ({
      ...provided,
      color: inputFontColor,
    }),
    singleValue: provided => ({
      ...provided,
      color: inputFontColor,
    }),
    menuList: provided => ({
      ...provided,
      backgroundColor: bgColor,
    }),
    option: (provided, {isFocused, isSelected}) => ({
      ...provided,
      color: isSelected || isFocused ? '#ffffff' : fontColor,
      backgroundColor:
        isSelected || isFocused ? '#017bcc' : provided.backgroundColor,
    }),
    container: provided => ({
      ...provided,
      width: '20rem',
    }),
    placeholder: provided => ({
      ...provided,
      color: theme === 'light' ? '#767676' : '#8d8d8e',
    }),
  };

  const options = props.scripts.map((script, idx) => ({
    value: idx,
    label: script.name,
    id: script.id,
  }));

  return (
    <Select
      styles={selectStyles}
      placeholder="🔎  Search Script"
      onChange={newValue =>
        dispatch({
          type: 'addTab',
          script: props.scripts[(newValue as Option).value],
        })
      }
      value={options.filter(opt => opt.id === props.activeTab?.scriptId)}
      options={options}
    />
  );
};
