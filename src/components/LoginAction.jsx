import React from 'react';

const LoginAction = ({ handleSubmit, type = 'Button', action = 'submit', text }) => {

  return (
    <div>
      {type === 'Button' ? (
        <button
          type={action}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mt-10`}
          onSubmit={handleSubmit}
        >
          {text}
        </button>
      ) : null}
    </div>
  );
};

export default LoginAction;
