import React, { useState } from "react";
import Style from "./MyPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetUser,
  killAllStateUser,
  selectUser,
} from "../../../redax/slices/userSlice";
import { selectAuth } from "../../../redax/slices/authSlice";
import ButtonsNavigation from "../../Buttons/ButtonsNavigation/ButtonsNavigation";
import ErrServer from "../../ErrServer/ErrServer";
import MyPageSceleton from "./MyPageSceleton";
import ModuleBigFoto from "../../Moduls/ModuleBigFoto/ModuleBigFoto";
import { URL_SERVER } from "../../../utils/Constants";

export default function MyPage() {
  const dispatch = useDispatch();
  const { user, errServer, showSceletonPage } = useSelector(selectUser);
  const { token } = useSelector(selectAuth);
  const [showBigAvatar, isShowBigAvatar] = useState(false);

  React.useEffect(() => {
    dispatch(fetchGetUser(token));
  }, []);

  // React.useEffect(() => {
  //   return () => dispatch(killAllStateUser());
  // }, []);

  return (
    <div className={Style.use_conteiner}>
      <ButtonsNavigation page={"/"} text={"Назад"} />
      {showSceletonPage ? (
        <MyPageSceleton />
      ) : errServer ? (
        <ErrServer textErr="На сервере произошла ошибка, попробуйте зайти позже." />
      ) : (
        <div className={Style.use_card}>
          <img
            className={
              user.avatar
                ? `${Style.foto} ${Style.fotoCursor}`
                : `${Style.foto}`
            }
            onClick={() => {
              if (user.avatar) {
                isShowBigAvatar(true);
              }
            }}
            src={
              user.avatar
                ? `${URL_SERVER}/${user.avatar}`
                : "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
            }
            alt="аватарка"
          />
          <ul className={Style.discription}>
            <li className={Style.title}>
              <span>Имя:</span>
              <p>{user.name}</p>
            </li>
            <li className={Style.title}>
              <span>Город:</span>
              <p>{user.town}</p>
            </li>
            <li className={Style.title}>
              <span>Возраст:</span>
              <p>{user.age}</p>
            </li>
            <li className={Style.title}>
              <span>Пол:</span>
              <p>{user.gender}</p>
            </li>
            <li className={Style.title}>
              <span>Email:</span>
              <p>{user.email}</p>
            </li>
          </ul>

          <ButtonsNavigation
            page={"/edit-user"}
            text={"Редактировать профиль"}
          />
        </div>
      )}
      {showBigAvatar && (
        <ModuleBigFoto
          isShowBigAvatar={() => isShowBigAvatar(false)}
          url={user.avatar}
        />
      )}
    </div>
  );
}
