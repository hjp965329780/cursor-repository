import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

export interface ProductStudioConfig {
    appId: string;
    apiEndpoint?: string;
    containerId?: string;
}

export function init(config: ProductStudioConfig) {
    if (!config.appId) {
        console.error("Product Studio: appId is required");
        return;
    }

    const containerId = config.containerId || "product-studio-root";
    const apiEndpoint = config.apiEndpoint || "http://localhost:3000/api";
    let container = document.getElementById(containerId);

    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
    }

    const root = ReactDOM.createRoot(container);
    root.render(
        React.createElement(App, {
            config: {
                appId: config.appId,
                apiEndpoint,
            },
        })
    );

    console.log("Product Studio initialized");
}
