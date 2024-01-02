import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = (props) => (
  <ContentLoader
    speed={1}
    width="100%"
    height="10%"
    viewBox="0 0 1280 165"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="5" rx="0" ry="0" width="95" height="110" />
    <rect x="105" y="51" rx="0" ry="0" width="100%" height="24" />
    <rect x="105" y="91" rx="0" ry="0" width="100%" height="24" />
    <rect x="105" y="5" rx="0" ry="0" width="100%" height="30" />
    <rect x="5" y="118" rx="0" ry="0" width="100%" height="38" />
  </ContentLoader>
);

export default MyLoader;
