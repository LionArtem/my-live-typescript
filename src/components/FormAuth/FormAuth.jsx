import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAddUser,
  fetchLoginUser,
  selectAuth,
  resetTextArrAnswerServer,
  resetForm,
} from '../../redax/slices/authSlice';

import {
  setValue,
  selectformValidetion,
  killAllStateFormValidetion,
  setValid,
} from '../../redax/slices/formValidetionSlice';

import Style from './FormAuth.module.scss';
import TextInteractionForm from '../TextInteractionForm/TextInteractionForm';
import ButtonSubmit from '../Buttons/ButtonSubmit/ButtonSubmit';
import ModulContainer from '../Moduls/ModulContainer/ModulContainer';

export default function FormAuth({ textButton, text }) {
  const dispatch = useDispatch();
  const { value, errors, valid } = useSelector(selectformValidetion);
  const { showPreloader, textArrAnswerServer, fopmReg } =
    useSelector(selectAuth);

  const [focusInputEmail, isFocusInputEmail] = useState(false);
  const [focusInputPassword, isFocusInputPassword] = useState(false);

  const loginUser = (email, password) => {
    dispatch(fetchLoginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetForm());
        dispatch(killAllStateFormValidetion());
      } else {
        dispatch(setValid());
      }
    });
  };

  const checkEmptyField = (value, name, text) => {
    if (value) {
      dispatch(
        setValue({
          name,
          errors: text,
        })
      );
    }
  };

  const handleSubmit = (e) => {
    checkEmptyField(!value.email, 'email', 'Заполните это поле');
    checkEmptyField(!value.password, 'password', 'Заполните это поле');
    e.preventDefault();
    if (!valid) {
      isFocusInputEmail(true);
      isFocusInputPassword(true);
      return;
    }
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (fopmReg) {
      dispatch(fetchAddUser({ email, password })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          loginUser(email, password);
        } else {
          dispatch(setValid());
        }
      });
    } else {
      loginUser(email, password);
    }
  };

  const collectValidetion = (evt) => {
    textArrAnswerServer.length > 0 && dispatch(resetTextArrAnswerServer());
    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: evt.target.validationMessage,
        valid: evt.target.closest('form').checkValidity(),
      })
    );
  };

  const closeForm = () => {
    dispatch(resetForm());
    dispatch(killAllStateFormValidetion());
  };

  return (
    <ModulContainer clickOverly={() => closeForm()}>
      <form noValidate onSubmit={(e) => handleSubmit(e)} className={Style.form}>
        <div
          onClick={() => {
            closeForm();
          }}
          className={Style.button_close}
        ></div>
        <p className={Style.title}>{text}</p>
        <input
          onBlur={() => isFocusInputEmail(true)}
          onFocus={() => isFocusInputEmail(false)}
          pattern="[a-zA-Z0-9._\-]+@[a-zA-Z0-9._\-]+\.[a-zA-Z0-9_\-]+"
          value={value.email ?? ''}
          onChange={(evt) => {
            collectValidetion(evt);
          }}
          type="email"
          name="email"
          placeholder="email"
          required
        ></input>
        <TextInteractionForm text={focusInputEmail && errors.email} />
        <input
          onBlur={() => isFocusInputPassword(true)}
          onFocus={() => isFocusInputPassword(false)}
          value={value.password ?? ''}
          onChange={(evt) => {
            collectValidetion(evt);
          }}
          type="password"
          name="password"
          placeholder="пароль"
          minLength={8}
          required
        ></input>
        <TextInteractionForm text={focusInputPassword && errors.password} />
        <ButtonSubmit
          valid={true}
          showPreloader={showPreloader}
          textAnswerRequest={textArrAnswerServer}
          text={textButton}
        />
      </form>
    </ModulContainer>
  );
}
