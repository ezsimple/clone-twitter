import React, { useEffect, useState } from "react";
import AppRouter from "components/Route";
import { authService } from "fbase";

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setIsLoggedIn(user ? true : false);
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing ..."}
      <footer>&copy; {new Date().getFullYear()} clone-twitter</footer>
    </>
  );
};

export default App;
