import { useMemo } from 'react';

export interface SeasonalEffectSettings {
  particleCount?: number;
  particleSize?: string;
  particleOpacity?: number;
  fallSpeed?: string;
  color?: string;
  blur?: string;
  crackerCount?: number;
  crackerSize?: string;
  duration?: string;
  particlesPerCracker?: number;
  colors?: string[];
}

export interface SeasonalEffect {
  name: string;
  type: 'snow' | 'crackers' | 'confetti';
  enabled: boolean;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  settings: SeasonalEffectSettings;
}

interface UseSeasonalEffectsReturn {
  activeEffect: SeasonalEffect | null;
  isActive: boolean;
}

const isDateInRange = (
  currentDate: Date,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number
): boolean => {
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }

  if (startMonth < endMonth) {
    if (month === startMonth) {
      return day >= startDay;
    }
    if (month === endMonth) {
      return day <= endDay;
    }
    return month > startMonth && month < endMonth;
  }

  // Handle year-spanning ranges (e.g., Dec 10 to Jan 1)
  if (month === startMonth) {
    return day >= startDay;
  }
  if (month === endMonth) {
    return day <= endDay;
  }
  return month > startMonth || month < endMonth;
};

export const useSeasonalEffects = (effects: SeasonalEffect[]): UseSeasonalEffectsReturn => {
  return useMemo(() => {
    const currentDate = new Date();
    
    // Find the first active effect
    const activeEffect = effects.find(
      (effect) =>
        effect.enabled &&
        isDateInRange(
          currentDate,
          effect.startMonth,
          effect.startDay,
          effect.endMonth,
          effect.endDay
        )
    ) || null;

    return {
      activeEffect,
      isActive: activeEffect !== null,
    };
  }, [effects]);
};
