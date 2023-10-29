![image](https://github.com/hooroobaby/amplify-workshop/assets/73383643/b3a6556a-e1bf-48d2-b838-465a0da8cf7e)


## 工作坊成品

1. FrontEnd - React
2. Serverless BackEnd - Amplify SDK 連接 GraphQL API, DynamoDB 及 Storage(S3)
3. GraphQL API 串接前後端資料
4. AWS Amplify Deploy & Hosting

# 工作坊開始

首先，開啟 AWS IDE 服務 - [Cloud9](https://aws.amazon.com/tw/cloud9/)

## 確認環境

- [Node.js](https://nodejs.org/) v14.x or later
  - `node -v` 有出現版本即可
- [npm](https://www.npmjs.com/) v6.14.4 or later
  - `npm -v` 有出現版本即可
- [git](https://git-scm.com/) v2.14.1 or later
  - `git --version` 有出現版本即可

## 前置 Amplify 環境

**1. 安裝最新的 Amplify CLI**

```bash
npm install -g @aws-amplify/cli`
```

<!-- - 若失敗，可以加上Sudo 等於Windows中的系統管理員身份 -->

- -g 表示 global => 在全域都可以使用

**2. 如果你想要在本地機器使用 Amplify CLI，你就需要連線到 AWS 帳戶**

> 我們今天都是用 Event Engine，所以還是要大家先配置 ( ; \_ ; )/~~~
> 如果回去想自己玩玩看，且你的電腦有有憑證的 AWS 配置檔案，才可以跳過這個步驟喔～

```bash
amplify configure
```

- 2-1：瀏覽器會跳出「AWS 登入視窗」
- 2-2：登入後，回到 CLI，他會請你選擇 Region 跟你的 AWS IAM User 資料

  > AWS IAM (Identity and Access Management) 用於管理在 AWS 中的 users 和權限

  - [ ] 回到瀏覽器
  - [ ] 在 AWS console 中輸入 IAM，創建一個 user 及 secret key

    1. 輸入 user name（通常會叫做`amplify-dev`，但可以輸入你喜歡的就好）> Next
       ![image](https://github.com/hooroobaby/amplify-workshop/assets/73383643/2ba0abd6-ee5a-4866-bb40-33c0bda01a3b)
    2. permission options 選擇**Attach policies directly**
       permission policies 選擇**AdministratorAccess-Amplify**
       ![image](https://github.com/hooroobaby/amplify-workshop/assets/73383643/7993e591-d8ca-4ae1-bed3-574825a192c3)
    3. 確認好就可以按 Create User 囉 ↖(^ω^)↗
       > 是不是發現 AccessKey 還是空的！我們來建立一下！～
    4. 回到 users list 點擊剛剛建立的 user > 點擊 Security credentials > 點擊**Create access keys** > 下一步 > 選擇**CLI**
    5. 接著，你就有`accessKeyId` 和 `secretAccessKey`啦～複製他們～
       ![image](https://github.com/hooroobaby/amplify-workshop/assets/73383643/e01488af-2e53-4523-bad1-a11e128dea49)

  - [ ] 複製 IAM 中的 `accessKeyId` 和 `secretAccessKey`輸入進 CLI 中

    ```bash
    Enter the access key of the newly created user:
    ? accessKeyId:  # YOUR_ACCESS_KEY_ID
    ? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
    This would update/create the AWS Profile in your local machine
    ? Profile Name:  # (default)

    Successfully set up the new user.
    ```

## 建立前端

**1. 將前端架構下載到電腦中**

```shell=
git clone
```

**2. 下載前端會需要用到的套件**

> 套件就是「別人寫好的工具」，這個專案中下載的套件包含 Amplify 官方提供的可以使用 javascript 來操作 amplify 的工具

確認自己有在資料夾下，若沒有則輸入`cd amplify-demo`，cd 到你目前的資料夾！！！

```shell=
npm install
```

**如果出現 Error 的話**:

- Mac 可以用 `sudo npm install` 再試一次（會要求輸入你電腦的密碼）
- Windows 可以用系統管理員身份執行 PowerShell

他會下載約一分鐘，下載完成後，前端就準備完成了 🎉

**3. 查看目前的前端有在正確的根目錄，然後啟動硬**

```shell=
npm start
```

指令執行後 Terminal 會停在執行的畫面，然後將畫面切回瀏覽器，打開 http://localhost:3000

**就可以看到剛剛用好的前端畫面了！**
**但這個時候我們只是蓋好一間餐廳，但還沒招募廚師跟服務員，因此現在畫面上的工具都不能動。**

## 建立後端

**1. 初始化專案**
有了前端跟 Amplify 的環境後，我們來初始化 Amplify 專案，並建置 API

> API(Application Interface)

- 1-1：首先，先在專案根目錄下初始化 Amplify 專案
  ```
  amplify init
  ```
  接著，**除了 Choose js framework 要選擇 React 之外，其他都選擇預設就好(按 Enter 就好)**

### API 相關

#### App.js

記得打開註解

```
// import { Amplify } from "aws-amplify";
// import awsconfig from "./aws-exports";

// Amplify.configure(awsconfig);
```

#### Main.js

1. return

```
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
```

2. [function] togglesong

```
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
```

3. fetchSong
   匯入後記得把 Main.js 中用到 fetchSong 的地方打開

```
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
```

#### AddSong.js

記得打開註解，才能用 graphAPI 來 createSong

```
// await API.graphql(
//   graphqlOperation(createSong, { input: createSongData })
// );
```
