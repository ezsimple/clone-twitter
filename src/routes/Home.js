import React, { useState, useEffect } from 'react';
import { dbService } from 'fbase';
// import { collection, query, orderBy } from 'firebase/firestore';

const collectionName = 'clone-tweeter';

const Home = ({ userObj }) => {
  const [row, setRow] = useState('');
  const [rows, setRows] = useState([]);

  const gettweets = async () => {
    const dbtweets = await dbService.collection(collectionName).get();

    setRows([]); // 초기화 : 반드시 await 다음에서 호출되어야 합니다.
    dbtweets.forEach((document) => {
      // spread attribute
      const rowObject = {
        ...document.data(),
        id: document.id,
      };
      setRows((prev) => [rowObject, ...prev]);
    });
  };

  // firestore의 변화를 감지하는 callback함수 onSnapshot
  // const checkFirestore = () => {
  //   dbService.collection(collectionName).onSnapshot((snapshot) => {
  //     console.log(snapshot.docs);
  //   });
  // };

  useEffect(() => {
    // gettweets();
    // const q = query(
    //   collection(dbService, collectionName),
    //   orderBy('createdAt', 'desc')
    // );
    dbService
      .collection(collectionName)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(docs);
        setRows(docs);
      });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    await dbService.collection(collectionName).add({
      text: row,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setRow('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setRow(value);
  };

  console.log(rows);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={row}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="tweet" />
      </form>
      <div>
        {rows.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
