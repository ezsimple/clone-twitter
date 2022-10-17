import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { collectionName } from './Const';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweet = ({ docObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(docObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      console.log(`${collectionName}/${docObj.id}`);
      await dbService.doc(`${collectionName}/${docObj.id}`).delete();

      // URL을 이용해서, ref를 찾을 수 있는 기능을 firebase에서 제공
      if (docObj.attachmentUrl !== '')
        storageService.refFromURL(docObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`${collectionName}/${docObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{docObj.text}</h4>
          {docObj.attachmentUrl && (
            <img src={docObj.attachmentUrl} alt="attachment" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
