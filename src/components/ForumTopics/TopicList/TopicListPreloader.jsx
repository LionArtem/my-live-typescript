import React from 'react';
import ContentLoader from 'react-content-loader';

const TopicListPreloader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="47"
   // viewBox="0 0 100 47"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="47" />
  </ContentLoader>
);

export default TopicListPreloader;
