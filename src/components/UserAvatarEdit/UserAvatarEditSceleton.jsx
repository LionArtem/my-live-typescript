import React from 'react';
import ContentLoader from 'react-content-loader';

export default function UserAvatarEditSceleton(props) {
  return (
    <ContentLoader
      speed={2}
      width="245"
      height="165"
      viewBox="0 0 245 165"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="6" rx="0" ry="0" width="208" height="160" />
      <rect x="213" y="6" rx="2" ry="2" width="32" height="32" />
      <rect x="213" y="43" rx="2" ry="2" width="32" height="32" />
    </ContentLoader>
  );
}
