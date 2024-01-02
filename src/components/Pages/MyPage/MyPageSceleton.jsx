import React from 'react';
import ContentLoader from 'react-content-loader';

export default function MyPageSceleton(props) {
  return (
    <ContentLoader
      speed={2}
      width="327"
      height="550"
      viewBox="0 0 327 550"
      backgroundColor="#f3f3f3"
      foregroundColor="#e5e5e5"
      {...props}
    >
      <rect x="25" y="15" rx="5" ry="5" width="252" height="252" />
      <rect x="25" y="290" rx="5" ry="5" width="252" height="27.5" />
      <rect x="25" y="332.5" rx="5" ry="5" width="252" height="27.5" />
      <rect x="25" y="375" rx="5" ry="5" width="252" height="27.5" />
      <rect x="25" y="417.5" rx="5" ry="5" width="252" height="27.5" />
      <rect x="25" y="460" rx="5" ry="5" width="252" height="27.5" />
      <rect x="25" y="507" rx="5" ry="5" width="252" height="32" />
     
    </ContentLoader>
  );
}
