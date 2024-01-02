import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { killAllStateAuth } from '../../redax/slices/authSlice';
import { killAllStateFormValidetion } from '../../redax/slices/formValidetionSlice';
import { killAllStateTopic } from '../../redax/slices/topicSlice';
import { killAllStateUser, selectUser } from '../../redax/slices/userSlice';
import { killPaginationState } from '../../redax/slices/paginationSlice';

import Style from './AuthorizedUser.module.scss';
import { Link } from 'react-router-dom';

export default function AuthorizedUser() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  return (
    <div className={Style.contener_auth}>
      <Link className={Style.button_open} to={'/my-page'}>
        Моя страница
      </Link>
      {user.admin && (
        <Link to={'/admin'} className={Style.button_open}>
          Панель администратора
        </Link>
      )}
      <p
        className={Style.button_open}
        onClick={() => {
          localStorage.clear();
          dispatch(killAllStateAuth());
          dispatch(killAllStateFormValidetion());
          dispatch(killAllStateTopic());
          dispatch(killAllStateUser());
          dispatch(killPaginationState());
        }}
      >
        Выйти
      </p>
    </div>
  );
}
