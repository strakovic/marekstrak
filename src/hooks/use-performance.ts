/**
 * Performance optimization hook that detects user preferences and system capabilities
 */
import { useState, useEffect } from 'react';

interface PerformanceSettings {
  reduceMotion: boolean;
  isLowEndDevice: boolean;
  batteryLevel: number | null;
  isOnBattery: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export function usePerformance(): PerformanceSettings & {
  shouldReduceAnimations: boolean;
  shouldPauseAnimations: boolean;
} {
  const [settings, setSettings] = useState<PerformanceSettings>({
    reduceMotion: false,
    isLowEndDevice: false,
    batteryLevel: null,
    isOnBattery: false,
    connectionSpeed: 'unknown',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Only run browser-specific code after mounting
    // Check for user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = mediaQuery.matches;

    // Detect low-end devices based on hardware concurrency and memory
    const isLowEndDevice = 
      navigator.hardwareConcurrency <= 2 || 
      // @ts-ignore - navigator.deviceMemory is not standard but widely supported
      (navigator.deviceMemory && navigator.deviceMemory <= 2);

    // Check battery status if available
    let batteryLevel: number | null = null;
    let isOnBattery = false;

    // @ts-ignore - Battery API is experimental
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery: any) => {
        batteryLevel = battery.level;
        isOnBattery = !battery.charging && battery.level < 0.2; // Low battery
      });
    }

    // Check connection speed
    let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
    // @ts-ignore - Connection API is experimental
    if (navigator.connection) {
      // @ts-ignore
      const effectiveType = navigator.connection.effectiveType;
      connectionSpeed = effectiveType === '4g' ? 'fast' : 'slow';
    }

    setSettings({
      reduceMotion,
      isLowEndDevice,
      batteryLevel,
      isOnBattery,
      connectionSpeed,
    });

    // Listen for changes to motion preference
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reduceMotion: e.matches }));
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [isMounted]);

  // Determine if animations should be reduced or paused
  const shouldReduceAnimations = 
    settings.reduceMotion || 
    settings.isLowEndDevice || 
    settings.connectionSpeed === 'slow';

  const shouldPauseAnimations = 
    settings.isOnBattery || 
    (settings.isLowEndDevice && settings.connectionSpeed === 'slow');

  return {
    ...settings,
    shouldReduceAnimations,
    shouldPauseAnimations,
  };
}