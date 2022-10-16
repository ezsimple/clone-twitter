import React, { useState, useEffect, useRef } from 'react';
import { dbService, storageService } from 'fbase';
import { collectionName } from 'components/Const';
import { v4 as uuidv4 } from 'uuid';
import Tweet from 'components/Tweet';
// import { collection, query, orderBy } from 'firebase/firestore';

// userObj is props
const Home = ({ userObj }) => {
  const [row, setRow] = useState('');
  const [rows, setRows] = useState([]);
  const [attachFile, setAttachFile] = useState();
  const fileInput = useRef();

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
  const onSubmit = async (event) => {
    event.preventDefault();

    // await dbService.collection(collectionName).add({
    //   text: row,
    //   createdAt: Date.now(),
    //   creatorId: userObj.uid,
    // });
    // setRow('');

    let attachmentUrl = '';
    if (attachFile !== '') {
      const uuid = uuidv4();
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuid}`); // uid(폴더명)/uuid(파일명)으로 생성됩니다.
      const response = await attachmentRef.putString(attachFile, 'data_url'); // putString 사용법은 문서로 다시 확인이 필요합니다.
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const rowObj = {
      text: row,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection(`${collectionName}`).add(rowObj);
    setRow('');
    setAttachFile('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setRow(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachFile(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachFile(null);
    // Clear버튼 클릭 후 file input에 남아 있는 이미지 파일명 지우기
    fileInput.current.value = '';
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="tweet" />
        {attachFile && (
          <>
            <div>
              <img
                src={attachFile}
                width="50px"
                height="50px"
                alt="your's profile"
              />
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          </>
        )}
      </form>
      <div>
        {rows.map((row) => (
          <Tweet
            key={row.id}
            docObj={row}
            isOwner={row.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
