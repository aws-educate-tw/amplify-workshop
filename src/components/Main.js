import { React, useState, useEffect } from "react";
import AddSong from "./AddSong";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FaRegPlayCircle } from "react-icons/fa";
import { API, graphqlOperation, Storage } from "aws-amplify";
import ReactPlayer from "react-player";
import { listSongs } from "../graphql/queries";
import { CiPause1 } from "react-icons/ci";

const Main = () => {
  const [songs, setSongs] = useState([]);
  const [songsPlaying, setSongsPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);
  const [imgURLlist, setImageURLlist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // when everytime App rerender
  useEffect(() => {
    // fetchSongs();
  }, []);

  // ========================= 內有兩隻API =========================
  // 1. play or pause the song
  const toggleSong = async (index) => {
    if (songsPlaying === index) {
      // setSongsPlaying("");
      setIsPlaying(!isPlaying);
      return;
    }

    let songFilePath = songs[index].filePath;
    const regex = /key=(.*?)}/;
    const match = songFilePath.match(regex);

    console.log("songFilePath => ", songFilePath);
    try {
      if (match) {
        const key = match[1];
        console.log("key => ", key);
        songFilePath = key;
      }
      const fileAccessUrl = await Storage.get(songFilePath, { expires: 240 }); // 4分鐘後過期，保護你的資料
      console.log("fileAccessUrl => ", songFilePath, fileAccessUrl);
      setAudioURL(fileAccessUrl);
      setSongsPlaying(index);
      return;
    } catch (error) {
      // 有失誤的話就不播東西
      console.error("error access the file from S3 => ", error);
      setAudioURL("");
      setSongsPlaying("");
    }
  };
  // 2. fetch all the songs
  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log("song List => ", songList);

      const songsWithImgLinks = [];
      const regex = /key=(.*?)}/;

      await Promise.all(
        songList.map(async (song) => {
          let imgPath = song.imgPath;
          const match = imgPath.match(regex);
          if (match) {
            const key = match[1];
            console.log("key => ", key);
            imgPath = key;
          }
          const imgAccessUrl = await Storage.get(imgPath, { expires: 180 });
          console.log("imgPath, imgAccessUrl => ", imgPath, imgAccessUrl);
          songsWithImgLinks.push(imgAccessUrl);
        })
      );
      setImageURLlist(songsWithImgLinks);
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs => ", error);
    }
  };
  // ========================= 主要前端頁面 =========================
  return (
    <div className="mainContent">
      <div className="">
        {showAddSong ? (
          <AddSong
            onUpload={() => {
              setShowAddSong(false);
              fetchSongs();
            }}
            onCancel={() => setShowAddSong(false)}
          />
        ) : (
          <AiOutlineAppstoreAdd
            className="addIcon"
            style={{ fontSize: "30px" }}
            onClick={() => setShowAddSong(true)}
          />
        )}
      </div>
      <div className="cardsWrap">
        {/* sample cards */}
        <div className="cards">
          <div className="cardImg">
            <img
              src="https://images.unsplash.com/photo-1609102026400-3c0ca378e4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80"
              alt="pic"
            />
            <FaRegPlayCircle
              className="playButton"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="cardContent">
            <h3>Song Name</h3>
            <p>description</p>
          </div>
        </div>
        {/* end of sample cards */}

        {/* 抓下來的每首歌，讓他一個一個顯示在頁面上 */}
        {/* 幫我貼在這邊！！ */}
        {songs.map((song, index) => {
          return (
            <div className="cards" key={song.id}>
              {/** 觸碰到cardImg就會播放或暫停 */}
              <div className="cardImg" onClick={() => toggleSong(index)}>
                <img src={imgURLlist[index]} alt={song.title} />
                {songsPlaying !== index || !isPlaying ? (
                  <FaRegPlayCircle
                    className="playButton"
                    style={{ fontSize: "40px" }}
                  />
                ) : (
                  <CiPause1
                    className="playButton"
                    style={{ fontSize: "40px" }}
                  />
                )}
              </div>

              <div className="cardContent">
                <h3>{song.title}</h3>
                <p>{song.description}</p>
              </div>
              {songsPlaying === index ? (
                <div className="AudioPlayer">
                  <>
                    <div className="desc">
                      <h3>{songs[songsPlaying].title}</h3>
                      <p>{songs[songsPlaying].description}</p>
                    </div>
                    <ReactPlayer
                      url={audioURL}
                      controls // display native player controls.
                      playing={songsPlaying === index && isPlaying} // when playingSong is fit with the current song. and user set it to play.
                      height="50px"
                      width={"70%"}
                      onPause={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                    />
                  </>
                </div>
              ) : null}
            </div>
          );
        })}
        {/* 抓下來的歌section End! */}
      </div>
    </div>
  );
};

export default Main;
