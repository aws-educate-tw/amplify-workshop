import React, { useState } from "react";
import { v4 as uuid } from "uuid";
// import { API, graphqlOperation, Storage } from "aws-amplify";
// import { createSong } from "../graphql/mutations";

// 這隻負責做新增音樂的功能
const AddSong = ({ onUpload, onCancel }) => {
  const [songData, setSongData] = useState({});
  const [musicData, setMusicData] = useState();
  const [IMGData, setIMGData] = useState();

  // 新增歌曲及歌曲資訊至DynamoDB，並傳至S3
  const onUploadSong = async () => {
    try {
      console.log("songData => ", songData);
      const { title, description } = songData;

      // S3
      const keyMusic = await Storage.put(`${uuid()}.mp3`, musicData, {
        contentType: "audio/mp3",
      });
      const keyIMG = await Storage.put(`${uuid()}.jpeg`, IMGData, {
        contentType: "image/jpeg",
      });

      // DynamoDB
      const createSongData = {
        id: uuid(),
        title,
        description,
        filePath: keyMusic,
        imgPath: keyIMG,
      };
      console.log("createSongData => ", createSongData);

      // AppSync會幫助我們連接至DynamoDB並創建歌曲
      // await API.graphql(
      //   graphqlOperation(createSong, { input: createSongData })
      // );

      onUpload();
    } catch (error) {
      console.log("createSong Failed => ", error);
    }
  };

  return (
    <div className="addSong">
      <form>
        <h1>Add Song</h1>
        <div className="line">
          <label>Song Name: </label>
          <input
            type="text"
            required
            value={songData.title}
            onChange={(e) =>
              setSongData({ ...songData, title: e.target.value })
            }
          />
        </div>
        <div className="line">
          <label>Description: </label>
          <input
            type="text"
            required
            value={songData.description}
            onChange={(e) =>
              setSongData({ ...songData, description: e.target.value })
            }
          />
        </div>
        <div className="line">
          <label>Music File: </label>
          <input
            type="file"
            required
            accept="audio/mp3"
            onChange={(e) => setMusicData(e.target.files[0])}
          />
        </div>
        <div className="line">
          <label>IMG File: </label>
          <input
            type="file"
            required
            accept="image/jpeg"
            onChange={(e) => setIMGData(e.target.files[0])}
          />
        </div>

        <div style={{ display: "inline-flex" }}>
          <div className="CancelIcon" onClick={() => onCancel()}>
            Cancel
          </div>
          <div className="AddIcon" onClick={onUploadSong}>
            Add Song
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSong;
