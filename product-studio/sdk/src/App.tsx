import React from 'react';
import { StoreProvider, ProductStudioConfig } from "./core/Store";
import { EditorPanel } from './components/EditorPanel';
import { GuideRenderer } from './components/GuideRenderer';
import { BannerRenderer } from './components/BannerRenderer';

export const App: React.FC<{ config: ProductStudioConfig }> = ({ config }) => {
    return (
        <StoreProvider config={config}>
            <BannerRenderer />
            <GuideRenderer />
            <EditorPanel />
        </StoreProvider>
    );
};
