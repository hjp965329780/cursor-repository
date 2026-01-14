import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GuideStep } from '../core/Store';

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 300px;
  z-index: 2147483647;
  font-family: sans-serif;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
  
  label {
    display: block;
    font-size: 12px;
    margin-bottom: 4px;
    color: #666;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: ${props => props.primary ? '#4299e1' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

interface StepEditorProps {
  initialData: Partial<GuideStep>;
  onSave: (step: GuideStep) => void;
  onCancel: () => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({ initialData, onSave, onCancel }) => {
  const [data, setData] = useState<Partial<GuideStep>>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleSubmit = () => {
    if (!data.title || !data.content) {
      alert('Please fill in title and content');
      return;
    }
    onSave(data as GuideStep);
  };

  return (
    <Container data-ps-ignore="true">
      <Title>{data.id ? 'Edit Step' : 'New Step'}</Title>
      <FormGroup>
        <label>Selector</label>
        <input value={data.selector || ''} disabled />
      </FormGroup>
      <FormGroup>
        <label>Title</label>
        <input 
          value={data.title || ''} 
          onChange={e => setData({...data, title: e.target.value})}
          placeholder="Enter title"
        />
      </FormGroup>
      <FormGroup>
        <label>Content</label>
        <textarea 
          value={data.content || ''} 
          onChange={e => setData({...data, content: e.target.value})}
          placeholder="Enter description"
          rows={3}
        />
      </FormGroup>
      <FormGroup>
        <label>Placement</label>
        <select 
          value={data.placement || 'top'} 
          onChange={e => setData({...data, placement: e.target.value as any})}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </FormGroup>
      <ButtonGroup>
        <Button onClick={onCancel}>Cancel</Button>
        <Button primary onClick={handleSubmit}>Save</Button>
      </ButtonGroup>
    </Container>
  );
};
