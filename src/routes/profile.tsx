import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #0984e3;
  cursor: pointer;
  justify-content: center;
  display: flex;
  align-items: center;
  svg {
    width: 60px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  font-size: 22px;
  padding: 5px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const EditButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;

interface IButton {
  $isRed?: boolean;
}

const Button = styled.button<IButton>`
  border: none;
  background-color: ${(props) => (props.$isRed ? "tomato" : "#0984e3")};
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [isLoading, setLoading] = useState(false);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(user?.displayName);
  const [lastValue, setLastValue] = useState(user?.displayName);
  const [nameLoading, setNameLoading] = useState(false);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      try {
        setLoading(true);
        const file = files[0];
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);
        setAvatar(avatarUrl);
        await updateProfile(user, { photoURL: avatarUrl });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  const onEdit = () => {
    setEditMode(true);
  };
  const onCancel = () => {
    setEditValue(lastValue);
    setEditMode(false);
  };
  const onSave = async () => {
    if (nameLoading || !editValue || !user) return;
    try {
      setNameLoading(true);
      await updateProfile(user, { displayName: editValue });
    } catch (e) {
      console.error(e);
    } finally {
      setNameLoading(false);
      setEditMode(false);
      setLastValue(editValue);
    }
  };
  return (
    <>
      <Wrapper>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg style={{ opacity: isLoading ? 0.5 : 1 }} src={avatar} />
          ) : (
            <svg
              style={{ opacity: isLoading ? 0.5 : 1 }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          onChange={onAvatarChange}
          id="avatar"
          type="file"
          accept="image/*"
        />
        <Name>
          {editMode ? (
            <Input
              value={editValue ?? ""}
              onChange={onChange}
              placeholder="새로운 이름을 입력해 주세요."
              required
            />
          ) : (
            user?.displayName ?? "Anonymous"
          )}
          {editMode ? (
            <>
              <Button $isRed={true} onClick={onCancel}>
                취소
              </Button>
              <Button onClick={onSave}>
                {nameLoading ? "저장 중.." : "저장"}
              </Button>
            </>
          ) : (
            <EditButton onClick={onEdit}>
              <svg
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </EditButton>
          )}
        </Name>
        <Tweets></Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Wrapper>
    </>
  );
};

export default Profile;
