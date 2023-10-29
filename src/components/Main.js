import { React, useState, useEffect } from "react";
import AddSong from "./AddSong";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { FaRegPlayCircle } from "react-icons/fa";
// import { API, graphqlOperation, Storage } from "aws-amplify";
// import ReactPlayer from "react-player";
// import { listSongs } from "../graphql/queries";
// import { CiPause1 } from "react-icons/ci";

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

  // 2. fetch all the songs

  // ========================= 主要前端頁面 =========================
  return (
    <div className="mainContent">
      <div className="">
        {showAddSong ? (
          <AddSong
            onUpload={() => {
              setShowAddSong(false);
              // fetchSongs();
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

        {/* 抓下來的歌section End! */}
      </div>
    </div>
  );
};

export default Main;
