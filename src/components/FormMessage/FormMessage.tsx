import React, { useState } from 'react';
import Style from './FormMessage.module.scss';
import { useSelector } from 'react-redux';
import {
  fetchAddMessageInTopic,
  selectTopics,
  resetTextAnswerRequest,
  setTextAnswerRequest,
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
import { useAppDispatch } from '../../redax/store';

export default function FormFormMessage({
  getMessages,
}: {
  getMessages: (page?: number) => void;
}) {
  const dispatch = useAppDispatch();
  const messageRef = React.useRef<HTMLTextAreaElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { allMessagesAndAuthors } = useSelector(selectUser);
  const { value, errors, valid } = useSelector(selectformValidetion);
  const { preloader, textAnswerRequest, quote } = useSelector(selectTopics);
  const { token } = useSelector(selectAuth);
  const [errValidation, isErrValidation] = useState(false);
  const [quotePopap, isQuotePopap] = useState(false);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>): void => {
    evt.preventDefault();
    if (!valid) {
      isErrValidation(true);
      return;
    }
    addMessage();
  };

  const deleteTextAnswerServer = (): void => {
    setTimeout(() => {
      dispatch(resetTextAnswerRequest());
    }, 1500);
  };

  const scrollForm = (): void => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const addMessage = (): void => {
    const id = localStorage.getItem('topicId');
    const userId = localStorage.getItem('userId');
    if (id && userId && token) {
      dispatch(
        fetchAddMessageInTopic({
          id,
          userId,
          message: (messageRef.current as HTMLTextAreaElement).value,
          quote,
          token,
        })
      ).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          getMessages();
          dispatch(resetValues());
          dispatch(setValid(false));
          setTimeout(scrollForm, 500);
          dispatch(addQuote(''));
        }
        deleteTextAnswerServer();
      });
    } else {
      dispatch(setTextAnswerRequest('при отправки сообщения произошла ошибка'));
      deleteTextAnswerServer();
    }
  };

  const validetionTextarea = (
    evt: React.ChangeEvent<HTMLTextAreaElement>
  ): { checkValid: boolean; taxtErr?: string } => {
    const regex = /[^\s]+/;
    const result = regex.test(evt.target.value);
    if (result) {
      return { checkValid: true };
    } else {
      return { checkValid: false, taxtErr: 'ввидите минимум один символ' };
    }
  };

  const changeValue = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: validetionTextarea(evt).taxtErr ?? '',
        valid: validetionTextarea(evt).checkValid,
      })
    );
  };

  return (
    <>
      {allMessagesAndAuthors && allMessagesAndAuthors.length >= 10 ? (
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
              name="textarea"
              required
              maxLength={500}
            ></textarea>
            <TextInteractionForm text={errValidation && errors.textarea} />
            <ButtonSubmit
              valid={valid}
              showPreloader={preloader}
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
