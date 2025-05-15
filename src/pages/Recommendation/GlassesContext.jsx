import React, { createContext, useState, useContext } from 'react';

const GlassesContext = createContext();

export const useGlasses = () => {
  const context = useContext(GlassesContext);
  if (!context) {
    throw new Error('useGlasses must be used within a GlassesProvider');
  }
  return context;
};

export const GlassesProvider = ({ children }) => {
  const [gender, setGender] = useState(null);
  const [faceShape, setFaceShape] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetSelections = () => {
    setGender(null);
    setFaceShape(null);
    setRecommendations([]);
    setError(null);
  };

  const value = {
    gender,
    setGender,
    faceShape,
    setFaceShape,
    recommendations,
    setRecommendations,
    isLoading,
    setIsLoading,
    error,
    setError,
    resetSelections,
  };

  return (
    <GlassesContext.Provider value={value}>
      {children}
    </GlassesContext.Provider>
  );
};
