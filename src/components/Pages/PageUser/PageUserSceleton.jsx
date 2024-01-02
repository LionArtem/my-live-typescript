import React from 'react';
import ContentLoader from 'react-content-loader';

export default function PageUserSceleton(props) {
  return (
    <ContentLoader
      speed={2}
      width="305"
      height="370"
      viewBox="0 0 305 370"
      backgroundColor="#f3f3f3"
      foregroundColor="#e5e5e5"
      {...props}
    >
      <rect x="0" y="15" rx="5" ry="5" width="305" height="300" />
      <rect x="0" y="322" rx="5" ry="5" width="305" height="20" />
      <rect x="0" y="349" rx="5" ry="5" width="305" height="20" />
    </ContentLoader>
  );
}
