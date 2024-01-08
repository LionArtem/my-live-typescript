import React, { useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import Style from './ForumTopics.module.scss';

import {
  fetchGetTopicPaginetion,
  killAllStateTopic,
  fetchAddTopic,
  selectTopics,
  resetSuccessRequest,
  resetTextAnswerRequest,
  setTextAnswerRequest,
} from '../../redax/slices/topicSlice';
import {
  selectformValidetion,
  setValue,
  resetValues,
  killAllStateFormValidetion,
  setValid,
} from '../../redax/slices/formValidetionSlice';

import TopicList from './TopicList/TopicList';
import Pagination from '../Pagination/Pagination';
import ButtonsNavigation from '../Buttons/ButtonsNavigation/ButtonsNavigation';
import ButtonSubmit from '../Buttons/ButtonSubmit/ButtonSubmit';
import TextInteractionForm from '../TextInteractionForm/TextInteractionForm';
import ErrServer from '../ErrServer/ErrServer';
import NavigationNotAuthUser from '../NavigationNotAuthUser/NavigationNotAuthUser';
import { useAppDispatch } from '../../redax/store';

export default function ForumTopics() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const { value, errors, valid } = useSelector(selectformValidetion);
  const {
    preloader,
    successRequest,
    textAnswerRequest,
    errTopicServer,
    numberPages,
  } = useSelector(selectTopics);
  const [showErrValidation, isShowErrValidation] = useState(false);
  const [validButton, isValidButton] = useState(false);
  const [notTopics, isNotTopics] = useState(false);

  const getTopic = (page = Number(localStorage.getItem('page')) ?? 1): void => {
    dispatch(fetchGetTopicPaginetion({ page })).then(() => isNotTopics(true));
  };

  const deleteTextErr = () => {
    setTimeout(() => dispatch(resetTextAnswerRequest()), 1500);
  };

  const showMistakeNumberCharacters = (): void => {
    dispatch(setValid(false));
    isValidButton(false);
    isShowErrValidation(true);
    dispatch(
      setValue({
        name: 'topic',
        errors: 'Название темы не должно содержать менее 2 символов и более 30',
      })
    );
  };

  const createTopic = (text: string): void => {
    dispatch(fetchAddTopic({ title: text })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeout(() => dispatch(resetSuccessRequest()), 1500);
        getTopic();
        isValidButton(false);
      }
      deleteTextErr();
      dispatch(resetValues());
    });
  };

  const addPost = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (value.topic) {
      if (value.topic.length < 2 || value.topic.length > 30) {
        showMistakeNumberCharacters();
        return;
      }
      if (!valid) {
        isShowErrValidation(true);
        isValidButton(false);
        inputRef.current?.focus();
        return;
      }
      createTopic(value.topic);
    } else {
      dispatch(setTextAnswerRequest('при создании темы произошла ошибка'));
      deleteTextErr();
    }
  };

  React.useEffect(() => {
    getTopic();
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(killAllStateTopic());
      dispatch(killAllStateFormValidetion());
      localStorage.removeItem('page');
    };
  }, []);

  const changeValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    isShowErrValidation(false);
    isValidButton(true);
    let errMessage = evt.target.validationMessage;
    if (!checkedStringGap(evt.target.value)) {
      errMessage = 'одного пробела достаточно!';
    }

    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: errMessage,
        valid: evt.target.closest('form')?.checkValidity(),
      })
    );
  };

  function checkedStringGap(string: string): boolean {
    const regex = /^((?!\s{2}).)*$/;
    const result = regex.test(string);
    return result;
  }

  return (
    <div className={Style.conteiner}>
      {localStorage.getItem('token') ? (
        <ButtonsNavigation page={'/'} text={'Назад'} />
      ) : (
        ''
      )}
      {errTopicServer ? (
        <ErrServer textErr="На сервере произошла ошибка, попробуйте зайти позже." />
      ) : (
        <>
          {localStorage.getItem('token') ? (
            <form noValidate onSubmit={(evt) => addPost(evt)}>
              <div>
                <input
                  ref={inputRef}
                  pattern="^((?!\s{2}).)*$"
                  type="text"
                  placeholder="введите название темы"
                  required
                  value={value.topic ?? ''}
                  name="topic"
                  onChange={(evt) => changeValue(evt)}
                  minLength={5}
                  maxLength={30}
                ></input>
                {showErrValidation && (
                  <TextInteractionForm text={errors.topic} />
                )}
              </div>
              <ButtonSubmit
                valid={validButton}
                showPreloader={preloader}
                successRequest={successRequest}
                textAnswerRequest={textAnswerRequest}
                text={'создать тему'}
              />
            </form>
          ) : (
            <div>
              <ButtonsNavigation page={'/'} text={'Назад'} />
              <NavigationNotAuthUser
                text={'Что бы создать тему нужно авторизироваться'}
              />
            </div>
          )}
          <TopicList notTopics={notTopics} getTopic={getTopic} />
          {numberPages.length > 1 && (
            <Pagination getNumberPage={getTopic} numberPages={numberPages} />
          )}
        </>
      )}
    </div>
  );
}
