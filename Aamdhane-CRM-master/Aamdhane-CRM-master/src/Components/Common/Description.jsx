import React from 'react';

export const Desc = (props) => {
  const { title, content } = props;
  return (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">
        <b>{title} : </b>
        {content}
      </p>
    </div>
  );
};
