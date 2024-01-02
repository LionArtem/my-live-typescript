import React from 'react';
import ContentLoader from 'react-content-loader';

export default function ListUsersSceleton(props) {
  return (
    <ContentLoader
      speed={2}
      width="212"
      height="358"
      viewBox="0 0 212 358"
      backgroundColor="#f3f3f3"
      foregroundColor="#e5e5e5"
      {...props}
    >
      <rect x="0" y="0" rx="0" ry="0" width="212" height="358" />
    </ContentLoader>
  );
}
