import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Route';
import { authService } from 'fbase';
// import { cloneDeep } from 'lodash';

const App = () => {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // using listener : onAuthStateChanged
    authService.onAuthStateChanged((user) => {
      // setIsLoggedIn(user ? true : false);
      // 로그아웃 이후 초기화면으로 이동을 위해서도 필요한 초기화
      setUserObj(user);
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    if (user === null) return;

    // (중요) 작은 오브젝트로 줄여서 저장하면,
    // React 는 객체변화를 감지하게 된다.
    // 아래의 방식은 재미난 방법 이네요
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => {
        user.updateProfile(args);
      },
    });

    // ======================================================================
    // (중요) 리액트는 vdom의 얕은 비교를 통해서, 객체를 갱신하게 되는데...
    // cloneDeep() method를 사용하면, 깊은 복사 & ref 의 주소가 갱신되어
    // 객체에 대해 새로 고침을 수행하게 됩니다.
    // ======================================================================
    // setUserObj(cloneDeep(user));
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'Initializing ...'
      )}
      <footer>&copy; {new Date().getFullYear()} clone-twitter</footer>
    </>
  );
};

export default App;
