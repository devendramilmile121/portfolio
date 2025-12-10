import React, { useEffect, useState } from 'react';
import { useSeasonalEffects, SeasonalEffect } from '@/hooks/useSeasonalEffects';
import SnowEffect from './effects/SnowEffect';
import CrackersEffect from './effects/CrackersEffect';
import ConfettiEffect from './effects/ConfettiEffect';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import '../styles/seasonal-effects.css';

interface SeasonalEffectsProps {
  effects: SeasonalEffect[];
  enabled?: boolean;
  onToggle?: () => void;
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({ effects, enabled = true, onToggle }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { activeEffect, isActive } = useSeasonalEffects(effects);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Show button only when effect is enabled and active
    setIsVisible(isMounted && enabled && isActive && !!activeEffect);
  }, [isMounted, enabled, isActive, activeEffect]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button on scroll
      if (isMounted && !!activeEffect) {
        setIsVisible(true);
        
        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        // Hide button after 3 seconds of no scroll
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isMounted, activeEffect]);

  if (!isMounted || !activeEffect) {
    return null;
  }

  // Render the appropriate effect based on type
  const renderEffect = () => {
    if (!enabled || !isActive) return null;
    
    switch (activeEffect.type) {
      case 'snow':
        return <SnowEffect settings={activeEffect.settings} key={activeEffect.name} />;
      case 'crackers':
        return <CrackersEffect settings={activeEffect.settings} key={activeEffect.name} />;
      case 'confetti':
        return <ConfettiEffect settings={activeEffect.settings} key={activeEffect.name} />;
      default:
        return null;
    }
  };

  return (
    <div className="seasonal-effects-container">
      {renderEffect() && (
        <div className={`seasonal-effect-wrapper ${enabled ? 'effect-visible' : 'effect-hidden'}`}>
          {renderEffect()}
        </div>
      )}
      {isVisible && enabled && onToggle && (
        <button
          onClick={onToggle}
          className="fixed bottom-8 left-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-glow/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center button-visible"
          title="Disable seasonal effect"
          aria-label="Disable seasonal effect"
        >
          <EyeOff className="h-5 w-5" />
        </button>
      )}
      {isVisible && !enabled && onToggle && (
        <button
          onClick={onToggle}
          className="fixed bottom-8 left-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-glow/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center button-visible"
          title="Enable seasonal effect"
          aria-label="Enable seasonal effect"
        >
          <Eye className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SeasonalEffects;
