import React from 'react';
import Style from './ModulePreloader.module.scss';
import ModulContainer from '../ModulContainer/ModulContainer';

export default function ModulePreloader({ text }) {
  return (
    <ModulContainer>
      <div className={Style.conteiner}>
        <p className={Style.title}>{text}</p>
        <div className={Style.animation}>
          <div className={Style.afterAnimation}></div>
        </div>
      </div>
    </ModulContainer>
  );
}
