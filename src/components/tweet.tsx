import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin: 0 auto;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Input = styled.input`
  margin: 10px 0px;
  font-size: 18px;
  width: 200px;
`;

interface IButton {
  $isRed?: boolean;
}

const Button = styled.button<IButton>`
  background-color: ${(props) => (props.$isRed ? "tomato" : "#0984e3")};
  color: white;
  font-weight: bold;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  width: fit-content;
`;

const EditPhoto = styled.label`
  padding: 5px 10px;
  color: white;
  background-color: #636e72;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;
  margin: auto;
  border-radius: 5px;
`;

const File = styled.input`
  display: none;
`;

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(tweet);
  const [isLoading, setLoading] = useState(false);
  const [lastValue, setLastValue] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);
  const onDelete = async () => {
    const ok = confirm("이 트윗을 정말로 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    } finally {
    }
  };
  const onEdit = async () => {
    setEditMode(true);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  const onSave = async () => {
    if (isLoading || user?.uid !== userId) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, `tweets/${id}`), { tweet: editValue });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        deleteObject(locationRef).catch((e: FirebaseError) => {
          if (e.code === "storage/object-not-found") {
            return;
          } else {
            console.error(e);
          }
        });
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, `tweets/${id}`), { photo: url });
        setFile(null);
      }
      await setLastValue(editValue);
      setEditMode(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const onCancel = () => {
    setEditValue(lastValue);
    setEditMode(false);
  };
  const onChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const oneMB = 1 * 1024 * 1024;
    if (files && files.length === 1 && files[0].size < oneMB) {
      setFile(files[0]);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editMode ? (
          <Input
            name="tweet"
            value={editValue}
            onChange={onChange}
            placeholder="변경할 내용을 입력하세요."
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <div>
            <Button $isRed={true} onClick={editMode ? onCancel : onDelete}>
              {editMode ? "취소" : "삭제"}
            </Button>
            {!editMode ? (
              <Button onClick={onEdit} disabled={isLoading}>
                수정
              </Button>
            ) : (
              <Button onClick={onSave}>
                {isLoading ? "저장 중.." : "저장"}
              </Button>
            )}
          </div>
        ) : null}
      </Column>
      <Column>
        {editMode ? (
          <>
            <EditPhoto htmlFor="editPhoto">
              {file ? "사진 추가됨 ✅" : "사진 수정하기"}
            </EditPhoto>
            <File
              type="file"
              accept="image/*"
              id="editPhoto"
              onChange={onChangePhoto}
            />
          </>
        ) : photo ? (
          <Photo src={photo} />
        ) : null}
      </Column>
    </Wrapper>
  );
};

export default Tweet;
