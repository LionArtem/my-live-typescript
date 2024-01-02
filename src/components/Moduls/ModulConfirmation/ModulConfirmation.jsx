import React, { useState } from 'react';
import Style from './ModulConfirmation.module.scss';
import ModulContainer from '../ModulContainer/ModulContainer';
import { useDispatch } from 'react-redux';
import { isStatusModule } from '../../../redax/slices/moduleConfirmationSlice';

export default function ModulConfirmation({ text, confirm }) {
  const dispatch = useDispatch();

  const confirmYes = () => {
    confirm();
    dispatch(isStatusModule(false));
  };

  return (
    <ModulContainer clickOverly={() => dispatch(isStatusModule(false))}>
      <div className={Style.window}>
        <p className={Style.title}>{text}</p>
        <p
          onClick={() => confirmYes()}
          className={`${Style.buttonYes} ${Style.button}`}
        >
          Да
        </p>
        <p
          onClick={() => dispatch(isStatusModule(false))}
          className={`${Style.buttonNo} ${Style.button}`}
        >
          Нет
        </p>
      </div>
    </ModulContainer>
  );
}
