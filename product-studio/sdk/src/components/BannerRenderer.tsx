import React from 'react';
import styled from 'styled-components';
import { useStore } from '../core/Store';

const Banner = styled.div<{ $type: 'info' | 'warning' | 'success' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  text-align: center;
  color: white;
  font-weight: 500;
  z-index: 2147483647;
  font-family: sans-serif;
  background-color: ${props => {
    switch(props.$type) {
      case 'info': return '#4299e1';
      case 'warning': return '#ed8936';
      case 'success': return '#48bb78';
      default: return '#4299e1';
    }
  }};
`;

export const BannerRenderer: React.FC = () => {
  const { state } = useStore();
  
  if (!state.banner.active) return null;

  return (
    <Banner $type={state.banner.type}>
      {state.banner.content}
    </Banner>
  );
};
