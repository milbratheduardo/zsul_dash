import React from 'react';
import {Link} from 'react-router-dom';

const HeaderModal = ({heading, paragraph, linkName, linkUrl, title}) => {
  return (
    <div className="mb-10">
            <h2 className="mt-6 text-center text-xl font-extrabold text-gray-900">
              {title}
            </h2>
            <h3 className="mt-6 text-center text-xl font-extrabold text-gray-600">
                {heading}
            </h3>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
            {paragraph} {' '}
            <Link to={linkUrl} className="font-medium text-cyan-600 hover:text-cyan-500">
                {linkName}
            </Link>
            </p>
        </div>
  )
}

export default HeaderModal