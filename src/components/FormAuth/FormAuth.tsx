import { useState } from 'react';

import { useSelector } from 'react-redux';
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
import { useAppDispatch } from '../../redax/store';

type FormAuthProps = {
  textButton: string;
  text: string;
};

export default function FormAuth({ textButton, text }: FormAuthProps) {
  const dispatch = useAppDispatch();
  const { value, errors, valid } = useSelector(selectformValidetion);
  const { showPreloader, textArrAnswerServer, fopmReg } =
    useSelector(selectAuth);

  const [focusInputEmail, isFocusInputEmail] = useState(false);
  const [focusInputPassword, isFocusInputPassword] = useState(false);

  const loginUser = (email: string, password: string): void => {
    dispatch(fetchLoginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetForm());
        dispatch(killAllStateFormValidetion());
      } else {
        dispatch(setValid(false));
      }
    });
  };

  const checkEmptyField = (
    value: boolean,
    name: string,
    text: string
  ): void => {
    if (value) {
      dispatch(
        setValue({
          name,
          errors: text,
        })
      );
    }
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>): void => {
    checkEmptyField(!value.email, 'email', 'Заполните это поле');
    checkEmptyField(!value.password, 'password', 'Заполните это поле');
    evt.preventDefault();
    if (!valid) {
      isFocusInputEmail(true);
      isFocusInputPassword(true);
      return;
    }
    const email: string = (evt.target as HTMLFormElement).email.value;
    const password: string = (evt.target as HTMLFormElement).password.value;

    if (fopmReg) {
      dispatch(fetchAddUser({ email, password })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          loginUser(email, password);
        } else {
          dispatch(setValid(false));
        }
      });
    } else {
      loginUser(email, password);
    }
  };

  const collectValidetion = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    textArrAnswerServer.length > 0 && dispatch(resetTextArrAnswerServer());
    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: evt.target.validationMessage,
        valid: evt.target.closest('form')?.checkValidity(),
      })
    );
  };

  const closeForm = (): void => {
    dispatch(resetForm());
    dispatch(killAllStateFormValidetion());
  };

  return (
    <ModulContainer clickOverly={() => closeForm()}>
      <form
        noValidate
        onSubmit={(evt) => handleSubmit(evt)}
        className={Style.form}
      >
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
        <TextInteractionForm
          text={focusInputEmail ? (errors.email ? errors.email : '') : ''}
        />
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
        <TextInteractionForm
          text={
            focusInputPassword ? (errors.password ? errors.password : '') : ''
          }
        />
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
