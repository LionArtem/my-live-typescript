import React, { useEffect, useState } from "react";
import Style from "./PageUser.module.scss";
import { notAuthRequest } from "../../../utils/NotAuthRequest";
import ErrServer from "../../ErrServer/ErrServer";
import ButtonsNavigation from "../../Buttons/ButtonsNavigation/ButtonsNavigation";
import PageUserSceleton from "./PageUserSceleton";
import ModuleBigFoto from "../../Moduls/ModuleBigFoto/ModuleBigFoto";
import { URL_SERVER } from "../../../utils/Constants";

export default function PageUser() {
  const [user, isUser] = useState();
  const [err, isErr] = useState(false);
  const [errText, isErrText] = useState("");
  const [showSceleton, isShowSceleton] = useState(false);
  const [showBigAvatar, isShowBigAvatar] = useState(false);

  useEffect(() => {
    isShowSceleton(true);
    notAuthRequest
      .getUserId(localStorage.getItem("CurrentUserId"))
      .then((user) => {
        isUser(user);
      })
      .catch((err) => {
        isErr(true);
        isErrText(err.message);
      })
      .finally(() => isShowSceleton(false));

    return () => localStorage.removeItem("CurrentUserId");
  }, []);

  const closeBigFoto = () => {
    isShowBigAvatar(false);
  };

  return (
    <div className={Style.pageUser}>
      <div className={Style.pageUser_buttonContainer}>
        <ButtonsNavigation page={-1} text={"Назад"} />
        <ButtonsNavigation page={"/"} text={"На главную"} />
      </div>
      {showSceleton ? (
        <PageUserSceleton />
      ) : err || !user ? (
        <ErrServer textErr={errText} />
      ) : (
        <div className={Style.pageUser_userCard}>
          <img
            onClick={() => {
              if (user.avatar) {
                isShowBigAvatar(true);
              }
            }}
            className={
              user.avatar
                ? `${Style.foto} ${Style.fotoCursor}`
                : `${Style.foto}`
            }
            src={
              user.avatar
                ? `${URL_SERVER}/${user.avatar}`
                : "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
            }
            alt="аватарка"
          />
          <p>{`${user.name} (${user.gender}. ${user.age})`}</p>
          <p>{user.town}</p>
        </div>
      )}
      {showBigAvatar && (
        <ModuleBigFoto isShowBigAvatar={closeBigFoto} url={user.avatar} />
      )}
    </div>
  );
}
