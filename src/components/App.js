import React, { useState } from 'react';
import AppRouter from 'components/AppRouter';
import { authService } from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn}></AppRouter>
      <footer>&copy; {new Date().getFullYear()} clone-twitter</footer>
    </>
  );
}

export default App;
