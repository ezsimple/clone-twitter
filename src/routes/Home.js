import { collectionName } from 'components/Const';
import Tweet from 'components/Tweet';
import TweetFactory from 'components/TweetFactory';
import { dbService } from 'fbase';
import { useEffect, useState } from 'react';
// import { collection, query, orderBy } from 'firebase/firestore';

// userObj is props
const Home = ({ userObj }) => {
  const [rows, setRows] = useState([]);

  // 자동으로 목록이 바뀌지 않습니다.
  // const gettweets = async () => {
  //   const dbtweets = await dbService.collection(collectionName).get();
  //   setRows([]); // 초기화 : 반드시 await 다음에서 호출되어야 합니다.
  //   dbtweets.forEach((document) => {
  //     // spread attribute
  //     const rowObject = {
  //       ...document.data(),
  //       id: document.id,
  //     };
  //     setRows((prev) => [rowObject, ...prev]);
  //   });
  // };

  // listener : onSnapshot()
  // 도큐먼트가 찾기 힘드네요.
  // https://firebase.google.com/docs/firestore/query-data/listen?authuser=0#listen_to_multiple_documents_in_a_collection
  // firestore의 변화를 감지하는 callback함수 onSnapshot

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

  // -------------------------------------------------------------------------
  // 1) Storage().ref().child() return Reference - storage의 이미지 폴더 생성.
  // 2) Reference.putString() - 이 작업이 폴더에 이미지를 넣는 작업.
  // 3) Reference.putString() return (완료시 UploadTaskSnapshot을 받음)
  // 4) UploadTaskSnapshot.ref.getDownloadURL()
  // - 이 작업에서 ref 속성을 쓰면 그 이미지의 Reference에 접근 가능,
  // 이미지가 저장된 stroage 주소를 받을 수 있다.
  // -------------------------------------------------------------------------

  return (
    <>
      <TweetFactory userObj={userObj} />
      <div>
        {rows.map((row) => (
          <Tweet
            key={row.id}
            docObj={row}
            isOwner={row.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
