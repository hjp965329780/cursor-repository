import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GuideStep {
  id: string;
  selector: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export interface BannerConfig {
  active: boolean;
  content: string;
  type: 'info' | 'warning' | 'success';
}

interface ProductStudioState {
  guides: GuideStep[];
  banner: BannerConfig;
  mode: 'edit' | 'preview' | 'hidden';
}

interface StoreContextType {
  state: ProductStudioState;
  addGuideStep: (step: GuideStep) => void;
  updateGuideStep: (id: string, step: Partial<GuideStep>) => void;
  removeGuideStep: (id: string) => void;
  updateBanner: (config: Partial<BannerConfig>) => void;
  setMode: (mode: 'edit' | 'preview' | 'hidden') => void;
  save: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductStudioState>({
    guides: [],
    banner: { active: false, content: 'Welcome!', type: 'info' },
    mode: 'edit',
  });

  useEffect(() => {
    const saved = localStorage.getItem('ps-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure structure
        setState(prev => ({ 
          ...prev, 
          guides: parsed.guides || [],
          banner: { ...prev.banner, ...parsed.banner }
        }));
      } catch (e) {
        console.error('Failed to load config', e);
      }
    }
  }, []);

  const save = () => {
    localStorage.setItem('ps-config', JSON.stringify({
      guides: state.guides,
      banner: state.banner,
    }));
    // Optional: Provide feedback or callback
    console.log('Configuration saved');
  };

  const addGuideStep = (step: GuideStep) => {
    setState(prev => ({ ...prev, guides: [...prev.guides, step] }));
  };

  const updateGuideStep = (id: string, step: Partial<GuideStep>) => {
    setState(prev => ({
      ...prev,
      guides: prev.guides.map(g => g.id === id ? { ...g, ...step } : g)
    }));
  };

  const removeGuideStep = (id: string) => {
    setState(prev => ({
      ...prev,
      guides: prev.guides.filter(g => g.id !== id)
    }));
  };

  const updateBanner = (config: Partial<BannerConfig>) => {
    setState(prev => ({ ...prev, banner: { ...prev.banner, ...config } }));
  };

  const setMode = (mode: 'edit' | 'preview' | 'hidden') => {
    setState(prev => ({ ...prev, mode }));
  };

  return (
    <StoreContext.Provider value={{ state, addGuideStep, updateGuideStep, removeGuideStep, updateBanner, setMode, save }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
