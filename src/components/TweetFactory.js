import React, { useState, useRef } from 'react';
import { dbService, storageService } from 'fbase';
import { collectionName } from './Const';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';

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
    if (isEmpty(row)) return;
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={row}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachFile && (
        <div className="factoryForm__attachment">
          <img
            src={attachFile}
            style={{
              backgroundImage: attachFile,
            }}
            alt="attachFile"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
