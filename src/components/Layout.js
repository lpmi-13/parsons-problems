import React from 'react';
import '../styles/layout.scss';

const Layout = ({ children }) => {
  return (
    <div role="main" className="container">
      {children}
    </div>
  )
}

export default Layout;