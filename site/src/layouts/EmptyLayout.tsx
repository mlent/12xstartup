import React from 'react';
import withRoot from '../withRoot';

const Layout = ({
  children,
  styles
}: {
  children: React.ReactNode;
  styles: React.CSSProperties;
}) => {
  return <div style={styles}>{children}</div>;
};

export default withRoot(Layout);
