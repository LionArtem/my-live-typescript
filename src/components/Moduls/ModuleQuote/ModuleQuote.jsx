import React from 'react';
import Stule from './ModuleQuote.module.scss';
import ModulContainer from '../ModulContainer/ModulContainer';

export default function ModuleQuote({ text, clickOverly }) {
  return (
    <ModulContainer clickOverly={() => clickOverly(false)}>
      <p className={Stule.text}>{text}</p>
    </ModulContainer>
  );
}
