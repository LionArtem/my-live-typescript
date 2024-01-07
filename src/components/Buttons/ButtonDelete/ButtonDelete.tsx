import React from "react";
import Style from "./ButtonDelete.module.scss";

interface ButtonDeleteProps {
  text: string;
  onClick: (id: string) => void;
  id: string;
}

export default function ButtonDelete({ text, onClick, id }: ButtonDeleteProps) {
  return (
    <div onClick={() => onClick(id)} className={Style.buttonDelete}>
      {text}
    </div>
  );
}
