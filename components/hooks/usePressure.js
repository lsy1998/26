import { useState, useEffect, useCallback } from 'react';

export const usePressure = () => {
  const [pressure, setPressure] = useState(1);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 检查是否支持压感
    const checkPressureSupport = () => {
      if (window.PointerEvent && 'pressure' in new PointerEvent('pointerdown')) {
        setIsSupported(true);
      }
    };
    checkPressureSupport();
  }, []);

  const handlePressureChange = useCallback((e) => {
    if (!isSupported) return;

    // 处理压感值
    const newPressure = e.pressure || 0.5;
    setPressure(newPressure);
  }, [isSupported]);

  return {
    pressure,
    isSupported,
    handlePressureChange,
  };
}; 