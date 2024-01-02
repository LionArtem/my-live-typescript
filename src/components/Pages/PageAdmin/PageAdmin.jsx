import React from 'react';
import Stule from './PageAdmin.module.scss';
import { useNavigate } from 'react-router-dom';
import ButtonsNavigation from '../../Buttons/ButtonsNavigation/ButtonsNavigation';

export default function PageAdmin() {
  const navigate = useNavigate();
  return (
    <div className={Stule.PageAdmin}>
      <ButtonsNavigation page={'/'} text={'Назад'} />
      <ul className={Stule.listContainer}>
        <li
          className={Stule.listContainer_title}
          onClick={() => navigate('/list-user')}
        >
          Список пользователей
        </li>
      </ul>
    </div>
  );
}
