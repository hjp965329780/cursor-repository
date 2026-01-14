import React from 'react';
import { StoreProvider } from './core/Store';
import { EditorPanel } from './components/EditorPanel';
import { GuideRenderer } from './components/GuideRenderer';
import { BannerRenderer } from './components/BannerRenderer';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <BannerRenderer />
      <GuideRenderer />
      <EditorPanel />
    </StoreProvider>
  );
};
