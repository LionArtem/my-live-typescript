import React, { useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Style from './ForumTopics.module.scss';

import {
  fetchGetTopicPaginetion,
  killAllStateTopic,
  fetchAddTopic,
  selectTopics,
  resetSuccessRequest,
  resetTextAnswerRequest,
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

export default function ForumTopics() {
  const dispatch = useDispatch();
  const inputRef = useRef();

  const { value, errors, valid } = useSelector(selectformValidetion);
  const {
    showPreloader,
    successRequest,
    textAnswerRequest,
    srrTopicServer,
    numberPages,
  } = useSelector(selectTopics);
  const [showErrValidation, isShowErrValidation] = useState(false);
  const [validButton, isValidButton] = useState(false);
  const [notTopics, isNotTopics] = useState(false);

  const getTopic = (page = localStorage.getItem('page') ?? 1) => {
    dispatch(fetchGetTopicPaginetion({ page })).then(() => isNotTopics(true));
  };

  const addPost = (evt) => {
    evt.preventDefault();
    if (value.topic.length < 2 || value.topic.length > 30) {
      dispatch(setValid(false));
      isValidButton(false);
      isShowErrValidation(true);
      dispatch(
        setValue({
          name: 'topic',
          errors:
            'Название темы не должно содержать менее 2 символов и более 30',
        })
      );
      return;
    }
    if (!valid) {
      isShowErrValidation(true);
      isValidButton(false);
      inputRef.current.focus();
      return;
    }

    dispatch(fetchAddTopic(value.topic)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setTimeout(() => dispatch(resetSuccessRequest()), 1500);
        getTopic();
        isValidButton(false);
      }
      setTimeout(() => dispatch(resetTextAnswerRequest()), 1500);
      dispatch(resetValues());
    });
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

  function checkedStringGap(string) {
    const regex = /^((?!\s{2}).)*$/;
    const result = regex.test(string);
    return result;
  }

  const changeValue = (evt) => {
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
        valid: evt.target.closest('form').checkValidity(),
      })
    );
  };

  return (
    <div className={Style.conteiner}>
      {localStorage.getItem('token') ? (
        <ButtonsNavigation page={'/'} text={'Назад'} />
      ) : (
        ''
      )}
      {srrTopicServer ? (
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
                showPreloader={showPreloader}
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
