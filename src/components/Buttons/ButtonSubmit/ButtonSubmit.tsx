
import Style from "./ButtonSubmit.module.scss";
import PreloaderPoint from "../../Preloaders/PreloaderPoint/PreloaderPoint";
import TextInteractionForm from "../../TextInteractionForm/TextInteractionForm";

type BottonSubmitProps = {
  valid: boolean;
  showPreloader: boolean;
  successRequest?: boolean;
  textAnswerRequest: string;
  text: string;
};

export default function BottonSubmit({
  valid,
  showPreloader,
  successRequest,
  textAnswerRequest,
  text,
}: BottonSubmitProps) {
  return (
    <div className={Style.bottonSubmit}>
      {valid ? (
        <button className={Style.button_form} type="submit">
          {text}
          {showPreloader && <PreloaderPoint />}
        </button>
      ) : (
        <button
          disabled
          className={`${Style.button_form} ${Style.button_form_off}`}
          type="submit"
        >
          {text}
          {showPreloader && <PreloaderPoint />}
        </button>
      )}
      <TextInteractionForm text={textAnswerRequest} request={successRequest} />
    </div>
  );
}
