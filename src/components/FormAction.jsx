import React from 'react';

const FormAction = ({type = 'Button', action = 'submit', text, currentColor, disabled }) => {
  const buttonStyle = {
    backgroundColor: currentColor,
    hoverBackgroundColor: `${currentColor}-700`,
  };
  
  return (
    <div>
      {type === 'Button' ? (
        <button
          type="submit"
          disabled={disabled}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-${currentColor}-600 hover:bg-${buttonStyle.hoverBackgroundColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mt-10`}
          style={{ backgroundColor: buttonStyle.backgroundColor }}
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormAction;
