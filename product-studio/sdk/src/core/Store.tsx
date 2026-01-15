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

export interface ProductStudioConfig {
    appId: string;
    apiEndpoint: string;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{
    children: React.ReactNode;
    config: ProductStudioConfig;
}> = ({ children, config }) => {
    const [state, setState] = useState<ProductStudioState>({
        guides: [],
        banner: { active: false, content: "Welcome!", type: "info" },
        mode: "edit",
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(
                    `${config.apiEndpoint}/config/${config.appId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    const hasConfig =
                        (data.guides && data.guides.length > 0) ||
                        (data.banner && data.banner.active);
                    setState((prev) => ({
                        ...prev,
                        guides: data.guides || [],
                        banner: { ...prev.banner, ...data.banner },
                        mode: hasConfig ? "preview" : "edit",
                    }));
                }
            } catch (e) {
                console.error("Failed to load config", e);
            }
        };

        if (config.appId && config.apiEndpoint) {
            fetchConfig();
        }
    }, [config.appId, config.apiEndpoint]);

    const save = async () => {
        try {
            const response = await fetch(
                `${config.apiEndpoint}/config/${config.appId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        guides: state.guides,
                        banner: state.banner,
                    }),
                }
            );

            if (response.ok) {
                console.log("Configuration saved");
                alert("Configuration saved successfully!");
            } else {
                console.error("Failed to save config");
                alert("Failed to save configuration.");
            }
        } catch (e) {
            console.error("Error saving config", e);
            alert("Error saving configuration.");
        }
    };

    const addGuideStep = (step: GuideStep) => {
        setState((prev) => ({ ...prev, guides: [...prev.guides, step] }));
    };

    const updateGuideStep = (id: string, step: Partial<GuideStep>) => {
        setState((prev) => ({
            ...prev,
            guides: prev.guides.map((g) =>
                g.id === id ? { ...g, ...step } : g
            ),
        }));
    };

    const removeGuideStep = (id: string) => {
        setState((prev) => ({
            ...prev,
            guides: prev.guides.filter((g) => g.id !== id),
        }));
    };

    const updateBanner = (config: Partial<BannerConfig>) => {
        setState((prev) => ({
            ...prev,
            banner: { ...prev.banner, ...config },
        }));
    };

    const setMode = (mode: "edit" | "preview" | "hidden") => {
        setState((prev) => ({ ...prev, mode }));
    };

    return (
        <StoreContext.Provider
            value={{
                state,
                addGuideStep,
                updateGuideStep,
                removeGuideStep,
                updateBanner,
                setMode,
                save,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
