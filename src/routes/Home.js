import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';

const Home = () => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const collectionName = 'clone-tweeter';

  const getTweets = async () => {
    const datas = await dbService
      .collection(collectionName)
      .orderBy('createAt', 'desc')
      .get();
    console.log(datas);
    datas.forEach((document) => {
      console.log(document.data());
      // spread attribute
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
    });
    console.log(tweets);
  };

  useEffect(() => {
    getTweets();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection(collectionName).add({
      tweet: tweet,
      createAt: Date.now(),
    });
    // .then(() => {
    //   console.log('Document successfully written!');
    // })
    // .catch((error) => {
    //   console.error('Error writing document: ', error);
    // });
    setTweet('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="What's on your mind"
            value={tweet}
            onChange={onChange}
            maxLength={120}
          />
          <input type="submit" value="Tweet" />
        </form>
        <div>
          {/* {tweets.map((doc) => (
            <div key={doc.id}>
              <h4>{doc.tweet}</h4>
            </div>
          ))} */}
        </div>
      </div>
    </>
  );
};

export default Home;
