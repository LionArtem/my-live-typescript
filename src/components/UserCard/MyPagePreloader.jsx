import React from 'react';
import ContentLoader from 'react-content-loader';

const MyPagePreloader = (props) => (
  <ContentLoader
    speed={2}
    width="170"
    height="380"
    viewBox="0 0 170 380"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="0" rx="0" ry="0" width="170" height="170" />
    <rect x="5" y="195" rx="0" ry="0" width="170" height="20" />
    <rect x="5" y="230" rx="0" ry="0" width="170" height="20" />
    <rect x="5" y="265" rx="0" ry="0" width="170" height="20" />
    <rect x="5" y="300" rx="0" ry="0" width="170" height="20" />
    <rect x="5" y="335" rx="0" ry="0" width="170" height="20" />
  </ContentLoader>
);

export default MyPagePreloader;
