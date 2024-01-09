import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Style from './TopicList.module.scss';

import {
  selectTopics,
  fetchDeleteTopic,
} from '../../../redax/slices/topicSlice';
import { selectUser, fetchGetUser } from '../../../redax/slices/userSlice';
import { selectAuth } from '../../../redax/slices/authSlice';
import { Link } from 'react-router-dom';

import { getTimeLocal } from '../../../utils/utils';
import TopicListPreloader from './TopicListPreloader';
import EmptyPage from '../../EmptyPage/EmptyPage';
import ModulConfirmation from '../../Moduls/ModulConfirmation/ModulConfirmation';
import ModulePreloader from '../../Moduls/ModulePreloader/ModulePreloader';
import {
  selectModuleConfirmation,
  isStatusModule,
} from '../../../redax/slices/moduleConfirmationSlice';
import { useAppDispatch } from '../../../redax/store';

type TopicListProps = {
  getTopic: (page?: number) => void;
  notTopics: boolean;
};

export default function TopicList({ getTopic, notTopics }: TopicListProps) {
  const dispatch = useAppDispatch();
  const { topicsInPage, preloaderTopic } = useSelector(selectTopics);
  const { user } = useSelector(selectUser);
  const { token } = useSelector(selectAuth);
  const [idTopic, isIdTopic] = useState('');
  const [preloaderDelete, isPreloaderDelete] = useState(false);
  const { statusModule } = useSelector(selectModuleConfirmation);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchGetUser({ token }));
    }
  }, []);

  const deleteTopic = (id: string): void => {
    dispatch(isStatusModule(false));
    isPreloaderDelete(true);
    dispatch(fetchDeleteTopic({ id })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        getTopic();
      } else {
        console.log('err');
      }
      isPreloaderDelete(false);
    });
  };

  const openConfirmation = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id: string
  ): void => {
    evt.preventDefault();
    evt.stopPropagation();
    isIdTopic(id);
    dispatch(isStatusModule(true));
  };

  return (
    <div className={Style.conteiner}>
      {preloaderTopic ? (
        <div className={Style.preloader_conteiner}>
          {[...new Array(10)].map((_, i) => (
            <TopicListPreloader key={i} />
          ))}
        </div>
      ) : topicsInPage.length > 0 ? (
        topicsInPage.map((obj) => (
          <Link to={'/topic'} key={obj._id}>
            <div className={Style.title}>
              <h1
                onClick={() => {
                  localStorage.setItem('topicId', obj._id);
                }}
              >
                {obj.title}
              </h1>
              <p>{getTimeLocal(obj.createdAt)}</p>
            </div>
            {user?.admin && (
              <button
                className={Style.button_delete}
                onClick={(evt) => openConfirmation(evt, obj._id)}
              ></button>
            )}
          </Link>
        ))
      ) : (
        notTopics && <EmptyPage text={'Нет созданных тем.'} />
      )}
      {statusModule && (
        <ModulConfirmation
          text={'Удалить тему?'}
          confirm={() => deleteTopic(idTopic)}
        />
      )}
      {preloaderDelete && <ModulePreloader text={'Удаление...'} />}
    </div>
  );
}
