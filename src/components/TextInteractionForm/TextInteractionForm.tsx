import Style from './TextInteractionForm.module.scss';

export default function TextInteractionForm({
  text,
  request = false,
}: {
  text: string;
  request: boolean;
}) {
  return (
    <span className={`${Style.error} ${request && Style.success} `}>
      {text}
    </span>
  );
}
