import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Style from "./Topic.module.scss";

import {
  selectTopics,
  fetchGetMessagePaginetion,
  isShowPreloaderMessage,
  changeErrGetMessage,
} from "../../../redax/slices/topicSlice";
import {
  fetchGetUserFindId,
  selectUser,
} from "../../../redax/slices/userSlice";

import FormMessage from "../../FormMessage/FormMessage";
import MessageUser from "../../MessageUser/MessageUser";
import Pagination from "../../Pagination/Pagination";
import ButtonsNavigation from "../../Buttons/ButtonsNavigation/ButtonsNavigation";

import { getTimeLocal } from "../../../utils/utils";
import ErrServer from "../../ErrServer/ErrServer";
import TopicPreloader from "./TopicPreloader";
import NavigationNotAuthUser from "../../NavigationNotAuthUser/NavigationNotAuthUser";
import { URL_SERVER } from "../../../utils/Constants";

export default function Topic() {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const {
    authorTopic,
    titleTopic,
    date,
    errGetMessage,
    showPreloaderMessage,
    numberPages,
  } = useSelector(selectTopics);

  const { errServerUserMessage } = useSelector(selectUser);

  const findUniqueAuthors = (res) => {
    // собираю массив уникальных id users
    let set = new Set(); // лучше производительность
    res.messages.forEach((element) => {
      set.add(element.userId);
    });
    const arrUniqueUserId = Array.from(new Set(set));
    return arrUniqueUserId;

    // const result = res.messages.reduce((acc, obj) => {
    //   if (acc.find((item) => item === obj.userId)) {
    //     return acc;
    //   }
    //   return [...acc, obj.userId];
    // }, []);
    // return result;
  };

  const getMessages = (page = localStorage.getItem("page") ?? 1) => {
    dispatch(isShowPreloaderMessage(true));
    dispatch(
      fetchGetMessagePaginetion({
        id: localStorage.getItem("topicId"),
        page,
      })
    ).then((resMessage) => {
      if (resMessage.meta.requestStatus === "fulfilled") {
        dispatch(
          fetchGetUserFindId({
            arrIdUser: findUniqueAuthors(resMessage.payload),
            messages: resMessage.payload,
          })
        ).then(() => {
          dispatch(isShowPreloaderMessage(false));
        });
      }
    });
  };

  React.useEffect(() => {
    if (!localStorage.getItem("topicId")) {
      dispatch(changeErrGetMessage(true));
    } else {
      getMessages();
    }
  }, []);

  const openPageUser = (id) => {
    localStorage.setItem("CurrentUserId", id);
    navigation("/user");
  };

  return (
    <div className={Style.topic}>
      <div className={Style.conteiner_navigation}>
        <div className={Style.buttons_navigation}>
          <ButtonsNavigation page={"/topics"} text={"Назад"} />
          <ButtonsNavigation page={"/"} text={"На главную"} />
        </div>
        {!localStorage.getItem("token") && (
          <NavigationNotAuthUser
            text={"Что бы написать сообщение нужно авторизироваться"}
          />
        )}
      </div>
      {errGetMessage || errServerUserMessage ? (
        <ErrServer textErr="На сервере произошла ошибка, попробуйте зайти позже." />
      ) : (
        <>
          <div className={Style.info_topic}>
            {showPreloaderMessage ? (
              <TopicPreloader />
            ) : (
              <>
                {" "}
                <h1>{titleTopic}</h1>
                <div className={Style.use_conteiner}>
                  <img
                    src={
                      authorTopic?.avatar
                        ? `${URL_SERVER}/${authorTopic?.avatar}`
                        : "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
                    }
                    alt="аватарка"
                  />
                  {authorTopic ? (
                    <>
                      <div className={Style.name}>
                        <h3 onClick={() => openPageUser(authorTopic?._id)}>
                          {authorTopic?.name}
                        </h3>
                        <p>{`(${authorTopic?.gender}.${authorTopic?.age})`}</p>
                      </div>
                      <p>{authorTopic?.town}</p>
                    </>
                  ) : (
                    "пользователь удален"
                  )}
                  <span>{getTimeLocal(date)}</span>
                </div>
              </>
            )}
          </div>
          <MessageUser getMessages={getMessages} />
          {localStorage.getItem("token") && (
            <FormMessage getMessages={getMessages} />
          )}
          {numberPages.length > 1 && (
            <Pagination getNumberPage={getMessages} numberPages={numberPages} />
          )}
        </>
      )}
    </div>
  );
}
