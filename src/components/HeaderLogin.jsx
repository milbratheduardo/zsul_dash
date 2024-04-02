import React from 'react';
import {Link} from 'react-router-dom';

const HeaderLogin = ({ logo, heading, paragraph, linkName, linkUrl, title }) => {
  return (
    <div className="mb-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {logo && <img src={logo} alt="Logo" 
        style={{ 
           
          width: '100%', 
          maxHeight: '170px', 
          marginBottom: '5px'
        }} />}
      <h3 className="text-center text-3xl font-extrabold text-gray-600">
        {heading}
      </h3>
      <p className="text-center text-sm text-gray-600 mt-5">
        {paragraph} {' '}
        <Link to={linkUrl} className="font-medium text-yellow-700 hover:text-yellow-800">
          {linkName}
        </Link>
        
      </p>
    </div>
  );
};

export default HeaderLogin