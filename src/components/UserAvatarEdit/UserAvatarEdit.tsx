import React, { useRef, useState } from 'react';
import Style from './UserAvatarEdit.module.scss';
import { selectAuth } from '../../redax/slices/authSlice';
import { selectUser, resetUserAvatar } from '../../redax/slices/userSlice';

import TextInteractionForm from '../TextInteractionForm/TextInteractionForm';
import { usersApi } from '../../utils/UserApi';
import { useSelector } from 'react-redux';
import UserAvatarEditSceleton from './UserAvatarEditSceleton';
import ModulePreloader from '../Moduls/ModulePreloader/ModulePreloader';
import { URL_SERVER } from '../../utils/Constants';
import { useAppDispatch } from '../../redax/store';

export default function UserAvatarEdit() {
  const dispatch = useAppDispatch();
  const refInputFile = useRef<HTMLInputElement>(null);
  const { token } = useSelector(selectAuth);
  const { user, showSceletonPage } = useSelector(selectUser);
  const [file, setFile] = useState<string | ArrayBuffer>();
  const [errorLoadingFile, setErrorLoadingFile] = useState('');
  const [showPreloader, isShowPreloader] = useState(false);

  const addFoto = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    isShowPreloader(true);
    const file = evt.target.files ? evt.target.files[0] : false;
    file && setFileToBase(file);
  };

  const setFileToBase = (file: File): void => {
    try {
      const render = new FileReader();
      render.readAsDataURL(file);
      render.onloadend = () => {
        if (!render.result) return;
        sendFile({ result: render.result, file });
      };
    } catch (error) {
      isShowPreloader(false);
      setErrorLoadingFile('Ошибка при загрузке файла!');
      setTimeout(() => setErrorLoadingFile(''), 3000);
    }
  };

  const sendFile = ({
    result,
    file,
  }: {
    result: string | ArrayBuffer;
    file: File;
  }): void => {
    const avatar = new FormData();
    avatar.append('avatar', file);

    if (token) {
      usersApi
        .addAvatar(avatar, token)
        .then(() => {
          setFile(result);
        })
        .catch((err) => {
          setErrorLoadingFile(err.message);
          setTimeout(() => setErrorLoadingFile(''), 3000);
        })
        .finally(() => isShowPreloader(false));
    }
  };

  const deleteFoto = (token, id) => {
    if (!user.avatar && !file) {
      return;
    }
    isShowPreloader(true);
    usersApi
      .deleteUsersAvatar(token, id)
      .then((res) => {
        setFile(null);
        dispatch(resetUserAvatar(''));
      })
      .catch((err) => {
        setErrorLoadingFile(err.message);
        setTimeout(() => setErrorLoadingFile(''), 3000);
      })
      .finally(() => isShowPreloader(false));
  };

  return (
    <>
      {showSceletonPage ? (
        <UserAvatarEditSceleton />
      ) : (
        <>
          <div className={Style.container_avatar}>
            {
              <img
                src={
                  file
                    ? file
                    : user.avatar
                    ? `${URL_SERVER}/${user.avatar}`
                    : 'https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg'
                }
                alt="аватар"
              />
            }
            <div className={Style.containerButton}>
              <div
                className={`${Style.button} ${Style.button_edit_foto}`}
                onClick={() => refInputFile.current.click()}
              ></div>
              <div
                className={`${Style.button} ${Style.button_delete_foto}`}
                onClick={() => deleteFoto(token, user._id)}
              ></div>
            </div>
          </div>
          <input
            ref={refInputFile}
            className={Style.input_file}
            type="file"
            name="avatar-foto"
            onChange={(evt) => addFoto(evt)}
            accept="image/*"
            required
          ></input>
          <TextInteractionForm text={errorLoadingFile} />
          {showPreloader && <ModulePreloader text="Загрузка..." />}
        </>
      )}
    </>
  );
}
