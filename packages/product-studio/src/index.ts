import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

export interface ProductStudioConfig {
  projectId?: string;
  containerId?: string;
}

export function init(config: ProductStudioConfig = {}) {
  const containerId = config.containerId || 'product-studio-root';
  let container = document.getElementById(containerId);
  
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(App));
  
  console.log('Product Studio initialized');
}
