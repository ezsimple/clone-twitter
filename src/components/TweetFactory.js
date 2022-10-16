import React, { useState, useRef } from 'react';
import { dbService, storageService } from 'fbase';
import { collectionName } from './Const';
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = ({ userObj }) => {
  const [row, setRow] = useState('');
  const [attachFile, setAttachFile] = useState();
  const fileInput = useRef();

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

  return (
    <>
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
    </>
  );
};

export default TweetFactory;
