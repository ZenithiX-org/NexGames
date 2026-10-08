import React, { useState, useEffect } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

export interface GradientPreset {
  id: string;
  name: string;
  color1: string;
  color2: string;
  color3: string;
  type?: 'waterPlane' | 'plane' | 'sphere';
  uStrength?: number;
  uDensity?: number;
  uFrequency?: number;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'cyber-aurora',
    name: 'Cyber Aurora',
    color1: '#07162c',
    color2: '#0d9488',
    color3: '#84cc16',
    type: 'waterPlane',
    uStrength: 2.4,
    uDensity: 1.2,
    uFrequency: 3.5,
  },
  {
    id: 'deep-cosmic',
    name: 'Deep Cosmic',
    color1: '#090a16',
    color2: '#4f46e5',
    color3: '#ec4899',
    type: 'waterPlane',
    uStrength: 2.2,
    uDensity: 1.1,
    uFrequency: 3.0,
  },
  {
    id: 'midnight-neon',
    name: 'Neon Matrix',
    color1: '#050c07',
    color2: '#15803d',
    color3: '#a3e635',
    type: 'waterPlane',
    uStrength: 2.0,
    uDensity: 1.0,
    uFrequency: 3.2,
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    color1: '#1c0a00',
    color2: '#ea580c',
    color3: '#eab308',
    type: 'waterPlane',
    uStrength: 2.1,
    uDensity: 1.2,
    uFrequency: 3.0,
  }
];

interface ShaderBackgroundProps {
  currentPresetId?: string;
  presetId?: string;
  interactive?: boolean;
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  currentPresetId,
  presetId,
}) => {
  const activeId = presetId || currentPresetId || 'cyber-aurora';
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activePreset = GRADIENT_PRESETS.find(p => p.id === activeId) || GRADIENT_PRESETS[0];

  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-[#07090e]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(13, 148, 136, 0.15), transparent 70%), radial-gradient(circle at 80% 80%, rgba(132, 204, 22, 0.12), transparent 60%)'
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#05070a]">
      {!hasWebGLError ? (
        <div className="absolute inset-0 opacity-80 transition-opacity duration-1000">
          <ShaderGradientCanvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            pixelDensity={1}
            fov={45}
            pointerEvents="none"
          >
            <ShaderGradient
              control="props"
              animate="on"
              type={activePreset.type || 'waterPlane'}
              uTime={0}
              uSpeed={0.18}
              uStrength={activePreset.uStrength ?? 2.2}
              uDensity={activePreset.uDensity ?? 1.1}
              uFrequency={activePreset.uFrequency ?? 3.2}
              uAmplitude={0}
              color1={activePreset.color1}
              color2={activePreset.color2}
              color3={activePreset.color3}
              brightness={1.05}
              grain="on"
              grainBlending={0.25}
              lightType="3d"
              envPreset="dawn"
              cAzimuthAngle={180}
              cPolarAngle={95}
              cDistance={3.6}
              cameraZoom={1}
            />
          </ShaderGradientCanvas>
        </div>
      ) : (
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${activePreset.color2}40, transparent), radial-gradient(circle 600px at 80% 90%, ${activePreset.color3}25, transparent)`
          }}
        />
      )}

      {/* 21st.dev Style Ambient Vignette & Fine Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_1px,#05070a_1px)] [background-size:32px_32px] opacity-25"
      />
      <div 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#05070a]/40 to-[#05070a]/90" 
      />
      <div 
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]"
      />
    </div>
  );
};
