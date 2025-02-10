import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
};

interface DateProviderProps {
  children: ReactNode;
}

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}; 