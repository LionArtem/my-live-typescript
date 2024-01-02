import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Style from "./MessageUser.module.scss";

import { selectUser } from "../../redax/slices/userSlice";
import {
  fetchDeleteMessage,
  selectTopics,
  addQuote,
} from "../../redax/slices/topicSlice";

import { getTimeLocal } from "../../utils/utils";
import MessageUserPreloader from "./MessageUserPreloader";
import EmptyPage from "../EmptyPage/EmptyPage";
import ModulConfirmation from "../Moduls/ModulConfirmation/ModulConfirmation";
import ModuleQuote from "../Moduls/ModuleQuote/ModuleQuote";

import {
  selectModuleConfirmation,
  isStatusModule,
} from "../../redax/slices/moduleConfirmationSlice";
import ModulePreloader from "../Moduls/ModulePreloader/ModulePreloader";
import { URL_SERVER } from "../../utils/Constants";

export default function MessageUser({ getMessages }) {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { allMessagesAndAuthors, user } = useSelector(selectUser);
  const { showPreloaderMessage } = useSelector(selectTopics);
  const [messageId, isMessageId] = useState();
  const { statusModule } = useSelector(selectModuleConfirmation);
  const [modulePreloader, isModulePreloader] = useState(false);
  const [quotePopap, isQuotePopap] = useState(false);
  const [quote, isQuote] = useState(null);

  const deleteMessage = (messageId) => {
    isModulePreloader(true);
    dispatch(
      fetchDeleteMessage({
        messageId,
        topicId: localStorage.getItem("topicId"),
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        getMessages();
      }
      isModulePreloader(false);
    });
  };

  const openConfirmation = (messageId) => {
    isMessageId(messageId);
    dispatch(isStatusModule(true));
  };

  React.useEffect(() => {
    return () => localStorage.removeItem("page");
  }, []);

  const openPageUser = (id) => {
    localStorage.setItem("CurrentUserId", id);
    navigation("/user");
  };

  const openFullQuote = (quote) => {
    isQuote(quote);
    isQuotePopap(true);
  };

  return (
    <>
      {showPreloaderMessage ? (
        [...new Array(10)].map((_, i) => <MessageUserPreloader key={i} />)
      ) : allMessagesAndAuthors.length > 0 ? (
        allMessagesAndAuthors.map((obj) => (
          <div key={obj.messages._id} className={Style.root}>
            <div className={Style.use_conteiner}>
              {obj.user ? (
                <>
                  <img
                    className={Style.foto}
                    src={
                      obj.user.avatar
                        ? `${URL_SERVER}/${obj.user.avatar}`
                        : "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
                    }
                    alt="аватарка"
                  />
                  <div className={Style.name}>
                    <h3 onClick={() => openPageUser(obj.user._id)}>
                      {" "}
                      {obj.user.name}
                    </h3>
                    <p>{`(${obj.user.gender}.${obj.user.age})`}</p>
                  </div>
                  <p className={Style.sity}>{obj.user.town}</p>
                  <span>{getTimeLocal(obj.messages.createdAt)}</span>
                  {user.admin && (
                    <button
                      onClick={() => openConfirmation(obj.messages._id)}
                      className={Style.button_delete}
                    ></button>
                  )}
                </>
              ) : (
                <>
                  <img
                    className={Style.foto}
                    src="https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
                    alt="аватарка"
                  />
                  <h3>Пользователь удалён</h3>
                  <p></p>
                  <span>{getTimeLocal(obj.messages.createdAt)}</span>
                  {user.admin && (
                    <button
                      onClick={() => openConfirmation(obj.messages._id)}
                      className={Style.button_delete}
                    ></button>
                  )}
                </>
              )}
            </div>
            <div className={Style.containerMassage}>
              {user.name && (
                <span
                  className={Style.duttonQuote}
                  onClick={() => dispatch(addQuote(obj.messages.message))}
                >
                  цитата
                </span>
              )}
              {obj.messages?.quote.length > 0 && (
                <div
                  className={Style.containerQuote}
                  onClick={() => openFullQuote(obj.messages.quote)}
                >
                  <p className={Style.quote}>{`"${obj.messages?.quote.slice(
                    0,
                    100
                  )}..."`}</p>
                </div>
              )}
              <p className={Style.message}> {obj.messages.message}</p>
            </div>
          </div>
        ))
      ) : (
        <EmptyPage text={"Здесь пока нет сообщений."} />
      )}
      {statusModule && (
        <ModulConfirmation
          text={"Удалить сообщение?"}
          confirm={() => deleteMessage(messageId)}
        />
      )}
      {modulePreloader && <ModulePreloader text={"Удаление..."} />}
      {quotePopap && <ModuleQuote text={quote} clickOverly={isQuotePopap} />}
    </>
  );
}
