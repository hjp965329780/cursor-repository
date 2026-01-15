import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { generateSelector } from '../utils/selector';

const Overlay = styled.div<{ $top: number; $left: number; $width: number; $height: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background-color: rgba(66, 153, 225, 0.2);
  border: 2px solid #4299e1;
  pointer-events: none;
  z-index: 2147483647;
  transition: all 0.1s ease-out;
`;

const Label = styled.div`
  position: absolute;
  top: -24px;
  left: 0;
  background-color: #4299e1;
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 2px;
  white-space: nowrap;
  font-family: sans-serif;
  pointer-events: none;
`;

interface InspectorProps {
  onSelect: (element: HTMLElement, selector: string) => void;
  active: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({ onSelect, active }) => {
  const [target, setTarget] = useState<{ rect: DOMRect; tagName: string } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!active) return;
    const el = e.target as HTMLElement;
    
    // Ignore inspector UI and other ps- components
    if (el.closest('[data-ps-ignore]')) return;

    setTarget({
      rect: el.getBoundingClientRect(),
      tagName: el.tagName.toLowerCase(),
    });
  }, [active]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!active) return;
    
    const el = e.target as HTMLElement;
    if (el.closest('[data-ps-ignore]')) return;

    // Stop propagation to prevent triggering actions on the page
    e.preventDefault();
    e.stopPropagation();

    const selector = generateSelector(el);
    onSelect(el, selector);
  }, [active, onSelect]);

  useEffect(() => {
    if (active) {
      document.addEventListener('mousemove', handleMouseMove, true);
      document.addEventListener('click', handleClick, true);
    } else {
      setTarget(null);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [active, handleMouseMove, handleClick]);

  if (!active || !target) return null;

  return (
    <Overlay
      $top={target.rect.top}
      $left={target.rect.left}
      $width={target.rect.width}
      $height={target.rect.height}
      data-ps-ignore="true"
    >
      <Label>{target.tagName}</Label>
    </Overlay>
  );
};
