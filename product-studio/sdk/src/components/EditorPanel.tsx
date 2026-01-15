import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore, GuideStep } from '../core/Store';
import { Inspector } from './Inspector';
import { StepEditor } from './StepEditor';

const Panel = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: ${props => props.$collapsed ? 'auto' : '320px'};
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 2147483646;
  font-family: sans-serif;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const Content = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #4a5568;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GuideList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GuideItem = styled.li`
  padding: 8px;
  background: #f7fafc;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:hover {
    background: #edf2f7;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #4299e1;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  
  &:hover {
    text-decoration: underline;
  }

  &.danger {
    color: #e53e3e;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 8px;

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
`;

export const EditorPanel: React.FC = () => {
  const { state, addGuideStep, updateGuideStep, removeGuideStep, updateBanner, save, setMode } = useStore();
  const [inspecting, setInspecting] = useState(false);
  const [editingStep, setEditingStep] = useState<Partial<GuideStep> | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  if (state.mode !== 'edit') return null;

  const handleSelect = (element: HTMLElement, selector: string) => {
    setInspecting(false);
    setEditingStep({
      id: crypto.randomUUID(),
      selector,
      title: '',
      content: '',
      placement: 'top'
    });
  };

  const handleSaveStep = (step: GuideStep) => {
    if (state.guides.some(g => g.id === step.id)) {
      updateGuideStep(step.id, step);
    } else {
      addGuideStep(step);
    }
    setEditingStep(null);
  };

  return (
    <>
      <Inspector active={inspecting} onSelect={handleSelect} />
      
      {editingStep && (
        <StepEditor 
          initialData={editingStep} 
          onSave={handleSaveStep}
          onCancel={() => setEditingStep(null)}
        />
      )}

      <Panel $collapsed={collapsed} data-ps-ignore="true">
        <Header>
          {collapsed ? 'PS' : 'Product Studio'}
          <ActionButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </ActionButton>
        </Header>
        
        {!collapsed && (
          <Content>
            <Section>
              <PrimaryButton onClick={() => setInspecting(!inspecting)}>
                {inspecting ? 'Cancel Selection' : '+ Add Guide Step'}
              </PrimaryButton>
            </Section>

            <Section>
              <SectionTitle>Top Banner</SectionTitle>
              <Toggle>
                <input 
                  type="checkbox" 
                  checked={state.banner.active}
                  onChange={e => updateBanner({ active: e.target.checked })}
                />
                Show Banner
              </Toggle>
              {state.banner.active && (
                <div style={{ marginTop: 8 }}>
                  <input 
                    style={{ width: '100%', padding: 4, marginBottom: 4 }}
                    value={state.banner.content}
                    onChange={e => updateBanner({ content: e.target.value })}
                    placeholder="Banner text"
                  />
                  <select 
                    style={{ width: '100%', padding: 4 }}
                    value={state.banner.type}
                    onChange={e => updateBanner({ type: e.target.value as any })}
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Orange)</option>
                    <option value="success">Success (Green)</option>
                  </select>
                </div>
              )}
            </Section>

            <Section>
              <SectionTitle>
                Steps ({state.guides.length})
              </SectionTitle>
              <GuideList>
                {state.guides.map(step => (
                  <GuideItem key={step.id}>
                    <span style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      maxWidth: 120 
                    }}>
                      {step.title}
                    </span>
                    <div>
                      <ActionButton onClick={() => setEditingStep(step)}>Edit</ActionButton>
                      <ActionButton className="danger" onClick={() => removeGuideStep(step.id)}>×</ActionButton>
                    </div>
                  </GuideItem>
                ))}
              </GuideList>
            </Section>

            <div style={{ display: 'flex', gap: 8 }}>
              <PrimaryButton onClick={save}>Save Config</PrimaryButton>
              <PrimaryButton 
                style={{ background: '#48bb78' }} 
                onClick={() => setMode('preview')}
              >
                Preview
              </PrimaryButton>
            </div>
          </Content>
        )}
      </Panel>
    </>
  );
};
