import * as React from 'react';

export default function TextInputWithFocusButton() {
  const inputEl = React.useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current?.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}