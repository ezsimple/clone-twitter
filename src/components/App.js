import React, { useState } from 'react';
import AppRouter from 'components/AppRouter';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn}></AppRouter>
      <footer>&copy; {new Date().getFullYear()} clone-twitter</footer>
    </>
  );
}

export default App;
