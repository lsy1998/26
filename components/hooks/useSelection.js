import { useState, useCallback } from 'react';

export const useSelection = () => {
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [isOverImage, setIsOverImage] = useState(false);
  const [isOverPin, setIsOverPin] = useState(false);
  const [isOverText, setIsOverText] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedImageId(null);
    setSelectedPinId(null);
    setSelectedTextId(null);
  }, []);

  const hasSelectedElement = selectedImageId || selectedPinId || selectedTextId;

  const handleDeleteSelected = useCallback((
    setImages,
    setPins,
    setTexts
  ) => {
    if (selectedImageId) {
      setImages(prev => prev.filter(img => img.id !== selectedImageId));
      setSelectedImageId(null);
    }
    if (selectedPinId) {
      setPins(prev => prev.filter(pin => pin.id !== selectedPinId));
      setSelectedPinId(null);
    }
    if (selectedTextId) {
      setTexts(prev => prev.filter(text => text.id !== selectedTextId));
      setSelectedTextId(null);
    }
  }, [selectedImageId, selectedPinId, selectedTextId]);

  return {
    selectedImageId,
    setSelectedImageId,
    selectedPinId,
    setSelectedPinId,
    selectedTextId,
    setSelectedTextId,
    isOverImage,
    setIsOverImage,
    isOverPin,
    setIsOverPin,
    isOverText,
    setIsOverText,
    clearSelection,
    hasSelectedElement,
    handleDeleteSelected,
  };
}; 