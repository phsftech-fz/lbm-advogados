import React, { useState, useEffect } from 'react';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
      {/* Restante do código do componente */}
    </div>
  );
};

export default App;