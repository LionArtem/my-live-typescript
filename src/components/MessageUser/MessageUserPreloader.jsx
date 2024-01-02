import React from 'react';
import ContentLoader from 'react-content-loader';

const MessageUserPreloader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="144"
   // viewBox="0 0 100 47"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="5" rx="0" ry="0" width="100" height="100" />
    <rect x="110" y="5" rx="0" ry="0" width="100" height="35" />
    <rect x="110" y="52" rx="0" ry="0" width="100" height="21" />
    <rect x="110" y="84" rx="0" ry="0" width="100" height="21" />
    <rect x="5" y="110" rx="0" ry="0" width="100%" height="100" />
  </ContentLoader>
);

export default MessageUserPreloader;
