import React from 'react';
import ContentLoader from 'react-content-loader';

const FormEditUserPreloader = (props) => (
  <ContentLoader
    speed={2}
    width="357"
    height="359"
    viewBox="0 0 357 359"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="25" rx="0" ry="0" width="332" height="334" />
  </ContentLoader>
);

export default FormEditUserPreloader;
