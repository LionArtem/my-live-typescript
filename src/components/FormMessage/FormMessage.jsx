import React, { useState } from 'react';
import Style from './FormMessage.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAddMessageInTopic,
  selectTopics,
  resetTextAnswerRequest,
  addQuote,
} from '../../redax/slices/topicSlice';

import { selectUser } from '../../redax/slices/userSlice';

import {
  setValue,
  selectformValidetion,
  resetValues,
  setValid,
} from '../../redax/slices/formValidetionSlice';

import ButtonSubmit from '../Buttons/ButtonSubmit/ButtonSubmit';
import TextInteractionForm from '../TextInteractionForm/TextInteractionForm';
import { selectAuth } from '../../redax/slices/authSlice';
import ModuleQuote from '../Moduls/ModuleQuote/ModuleQuote';

export default function Form({ getMessages }) {
  const dispatch = useDispatch();
  const messageRef = React.useRef();
  const formRef = React.useRef();
  const { allMessagesAndAuthors } = useSelector(selectUser);
  const { value, errors, valid } = useSelector(selectformValidetion);
  const { showPreloader, textAnswerRequest, quote } = useSelector(selectTopics);
  const { token } = useSelector(selectAuth);
  const [errValidation, isErrValidation] = useState(false);
  const [quotePopap, isQuotePopap] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!valid) {
      isErrValidation(true);
      return;
    }
    addMessage();
  };

  const deleteTextAnswerServer = () => {
    setTimeout(() => {
      dispatch(resetTextAnswerRequest());
    }, 1500);
  };

  const scrollForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const addMessage = () => {
    dispatch(
      fetchAddMessageInTopic({
        id: localStorage.getItem('topicId'),
        userId: localStorage.getItem('userId'),
        message: messageRef.current.value,
        quote,
        token,
      })
    ).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        getMessages();
        dispatch(resetValues());
        dispatch(setValid());
        setTimeout(scrollForm, 500);
        dispatch(addQuote(''));
      }
      deleteTextAnswerServer();
    });
  };

  const validetionTextarea = (evt) => {
    const regex = /[^\s]+/;
    const result = regex.test(evt.target.value);
    if (result) {
      return { checkValid: true };
    } else {
      return { checkValid: false, taxtErr: 'ввидите минимум один символ' };
    }
  };

  const changeValue = (evt) => {
    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: validetionTextarea(evt).taxtErr,
        valid: validetionTextarea(evt).checkValid,
      })
    );
  };

  return (
    <>
      {allMessagesAndAuthors.length >= 10 ? (
        ''
      ) : (
        <>
          <div className={Style.containerQuote}>
            {quote.length > 0 && (
              <>
                <span className={Style.containerQuote_title}>цитата:</span>
                <span
                  className={Style.containerQuote_subtitle}
                  onClick={() => isQuotePopap(true)}
                >{` ${quote}`}</span>
                <div
                  onClick={() => dispatch(addQuote(''))}
                  className={Style.containerQuote_delete}
                ></div>
              </>
            )}
          </div>

          <form
            ref={formRef}
            onSubmit={(evt) => handleSubmit(evt)}
            className={Style.form}
          >
            <textarea
              ref={messageRef}
              value={value.textarea ?? ''}
              onChange={(evt) => {
                changeValue(evt);
              }}
              className={Style.textarea}
              type="text"
              name="textarea"
              required
              maxLength={500}
            ></textarea>
            <TextInteractionForm text={errValidation && errors.textarea} />
            <ButtonSubmit
              valid={valid}
              showPreloader={showPreloader}
              textAnswerRequest={textAnswerRequest}
              text={'отправить'}
            />
          </form>
        </>
      )}
      {quotePopap && <ModuleQuote text={quote} clickOverly={isQuotePopap} />}
    </>
  );
}
