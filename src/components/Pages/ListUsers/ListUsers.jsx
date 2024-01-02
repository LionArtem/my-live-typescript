import React, { useEffect, useState } from "react";
import Style from "./ListUsers.module.scss";
import { usersApi } from "../../../utils/UserApi";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../../redax/slices/authSlice";
import {
  selectModuleConfirmation,
  isStatusModule,
} from "../../../redax/slices/moduleConfirmationSlice";

import UserCard from "../../UserCard/UserCard";
import ButtonsNavigation from "../../Buttons/ButtonsNavigation/ButtonsNavigation";
import Pagination from "../../Pagination/Pagination";
import ErrServer from "../../ErrServer/ErrServer";
import ButtonDelete from "../../Buttons/ButtonDelete/ButtonDelete";
import ModulConfirmation from "../../Moduls/ModulConfirmation/ModulConfirmation";
import ModulePreloader from "../../Moduls/ModulePreloader/ModulePreloader";
import { selectUser } from "../../../redax/slices/userSlice";
import ListUsersSceleton from "./ListUsersSceleton";

export default function ListUsers() {
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);
  const { statusModule } = useSelector(selectModuleConfirmation);
  const [users, isUsers] = useState([]);
  const [numberPages, isNumberPages] = useState([]);
  const [showPreloader, isShowPreloader] = useState(false);
  const [showSceleton, isShowSceleton] = useState(false);
  const [errServer, isErrServer] = useState(false);
  const [textErr, isTextErr] = useState("");
  const [idUser, isIdUser] = useState();
  const [textPreloader, isTextPreloader] = useState("");

  const getUsers = (page = localStorage.getItem("page") ?? 1) => {
    isShowSceleton(true);
    usersApi
      .getUsers(token, page)
      .then((res) => {
        isUsers(res.users);
        isNumberPages([...new Array(Math.ceil(res.numberUsers / 10))]);
      })
      .catch((err) => {
        isErrServer(true);
        isTextErr(err.message);
      })
      .finally(() => isShowSceleton(false));
  };

  useEffect(() => {
    getUsers();
    return () => localStorage.removeItem("page");
  }, []);

  const deleteUser = () => {
    dispatch(isStatusModule(false));
    isTextPreloader("Удаление...");
    isShowPreloader(true);
    usersApi
      .deleteUsers(token, idUser)
      .then((res) => {
        getUsers();
      })
      .catch((err) => {
        console.log(err);
        isTextPreloader("");
      })
      .finally(() => {
        isIdUser("");
        isShowPreloader(false);
      });
  };

  const clickButtonDelete = (id) => {
    isIdUser(id);
    dispatch(isStatusModule(true));
  };

  return (
    <div className={Style.ListUsers}>
      <div className={Style.conteinerButton}>
        <ButtonsNavigation page={"/admin"} text={"Назад"} />
        <ButtonsNavigation page={"/"} text={"На главную"} />
      </div>

      {errServer ? (
        <ErrServer textErr={textErr} />
      ) : (
        <ul className={Style.ListUsers_containerCard}>
          {showSceleton
            ? [...new Array(10)].map((_, i) => <ListUsersSceleton key={i} />)
            : users.map((user) => (
                <li key={user._id}>
                  <UserCard user={user} />
                  <ButtonDelete
                    id={user._id}
                    onClick={clickButtonDelete}
                    text={"Удалить профиль"}
                  />
                </li>
              ))}
        </ul>
      )}
      {numberPages.length > 1 && (
        <Pagination getNumberPage={getUsers} numberPages={numberPages} />
      )}
      {statusModule && (
        <ModulConfirmation confirm={deleteUser} text={"Удалить?"} />
      )}
      {showPreloader && <ModulePreloader text={textPreloader} />}
    </div>
  );
}
