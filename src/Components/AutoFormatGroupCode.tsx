import React, { useState } from 'react';

function AutoFormatGroupCode({value, onValueChange } : 
    {
        value: string;
        onValueChange: (value: string) => void;
    }) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 6);
    }

    setInputValue(value);

    // Pass the value to the parent component
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue.length === 4) {
      setInputValue(inputValue.slice(0, -2));
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={7}
      placeholder='xxx-xxx'
    />
  );
}

export default AutoFormatGroupCode;
