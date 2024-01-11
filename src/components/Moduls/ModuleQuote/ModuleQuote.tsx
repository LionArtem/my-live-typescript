import React from 'react';
import Stule from './ModuleQuote.module.scss';
import ModulContainer from '../ModulContainer/ModulContainer';

type ModuleQuoteProps = {
  text: string;
  clickOverly: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModuleQuote({ text, clickOverly }: ModuleQuoteProps) {
  return (
    <ModulContainer clickOverly={() => clickOverly(false)}>
      <p className={Stule.text}>{text}</p>
    </ModulContainer>
  );
}
