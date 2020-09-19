import React from 'react';
import withRoot from '../withRoot';
import styled from '../styled';

export const Wrapper = styled('div')`
  max-width: 800px;
  padding: 12px;
  margin: ${(p) => p.theme.spacing(6)}px auto;

  @media (max-width: 800px) {
    margin: ${(p) => p.theme.spacing(10)}px auto;
  }
`;

const Layout = ({
  children,
  styles
}: {
  children: React.ReactNode;
  styles: React.CSSProperties;
}) => {
  return (
    <>
      <div style={styles}>{children}</div>
    </>
  );
};

export default withRoot(Layout);
