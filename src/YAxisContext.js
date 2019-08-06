import React from "react";

const YAxisContext = React.createContext({});

const YAxisProvider = ({ children }) => {
  const [max, setMax] = React.useState(0);
  const updateMax = newMax => {
    if (newMax > max) {
      setMax(newMax);
    }
  };

  return (
    <YAxisContext.Provider value={{ updateMax, max }}>
      {children}
    </YAxisContext.Provider>
  );
};

export { YAxisContext as default, YAxisProvider };
