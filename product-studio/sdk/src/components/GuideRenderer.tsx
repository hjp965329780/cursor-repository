import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStore } from '../core/Store';

const Tooltip = styled.div<{ $top: number; $left: number; $placement: string }>`
  position: absolute;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2147483647;
  width: 200px;
  font-family: sans-serif;
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    ${props => {
      switch(props.$placement) {
        case 'top': return 'bottom: -12px; left: 50%; transform: translateX(-50%); border-top-color: white;';
        case 'bottom': return 'top: -12px; left: 50%; transform: translateX(-50%); border-bottom-color: white;';
        case 'left': return 'right: -12px; top: 50%; transform: translateY(-50%); border-left-color: white;';
        case 'right': return 'left: -12px; top: 50%; transform: translateY(-50%); border-right-color: white;';
        default: return '';
      }
    }}
  }
`;

function getTransform(placement: string) {
  switch(placement) {
    case 'top': return 'translate(-50%, -100%)';
    case 'bottom': return 'translate(-50%, 0)';
    case 'left': return 'translate(-100%, -50%)';
    case 'right': return 'translate(0, -50%)';
    default: return '';
  }
}

export const GuideRenderer: React.FC = () => {
  const { state, setMode } = useStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (state.mode !== 'preview' || state.guides.length === 0) return;
    setCurrentStepIndex(0);
  }, [state.mode, state.guides.length]);

  useEffect(() => {
    if (state.mode !== 'preview' || state.guides.length === 0) return;

    const step = state.guides[currentStepIndex];
    if (!step) return;

    const el = document.querySelector(step.selector) as HTMLElement;
    
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      let top = 0, left = 0;
      
      switch(step.placement) {
        case 'top':
          top = rect.top + scrollY - 10;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + scrollY + 10;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case 'left':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - 10;
          break;
        case 'right':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + 10;
          break;
      }
      
      setPosition({ top, left });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.warn('Element not found:', step.selector);
    }
  }, [currentStepIndex, state.mode, state.guides]);

  if (state.mode !== 'preview' || state.guides.length === 0) return null;

  const step = state.guides[currentStepIndex];
  if (!step) return null;

  return (
    <>
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 2147483647 }}>
        <button 
          onClick={() => setMode('edit')}
          style={{ padding: '8px 16px', background: '#4a5568', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Exit Preview
        </button>
      </div>
      
      {position && (
        <Tooltip 
          $top={position.top} 
          $left={position.left} 
          $placement={step.placement}
          style={{ transform: getTransform(step.placement) }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>{step.title}</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#666' }}>{step.content}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(p => p - 1)}
              style={{ padding: '4px 8px', cursor: 'pointer' }}
            >
              Prev
            </button>
            <button 
              onClick={() => {
                if (currentStepIndex < state.guides.length - 1) {
                  setCurrentStepIndex(p => p + 1);
                } else {
                  setMode('edit');
                  setCurrentStepIndex(0);
                }
              }}
              style={{ padding: '4px 8px', cursor: 'pointer', background: '#4299e1', color: 'white', border: 'none', borderRadius: 2 }}
            >
              {currentStepIndex === state.guides.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </Tooltip>
      )}
    </>
  );
};
