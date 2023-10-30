![](https://hackmd.io/_uploads/rJQC80jMp.png)

## 工作坊成品

1. FrontEnd - React
2. Serverless BackEnd - Amplify SDK 連接 GraphQL API, DynamoDB 及 Storage(S3)
3. GraphQL API 串接前後端資料
4. AWS Amplify Deploy & Hosting

# 工作坊開始

首先，開啟 AWS IDE 服務 - [Cloud9](https://aws.amazon.com/tw/cloud9/)
![](https://hackmd.io/_uploads/BkEAe93Ma.png)

## 確認環境

- [Node.js](https://nodejs.org/) v14.x or later
  - `node -v` 有出現版本即可
- [npm](https://www.npmjs.com/) v6.14.4 or later
  - `npm -v` 有出現版本即可
- [git](https://git-scm.com/) v2.14.1 or later
  - `git --version` 有出現版本即可

### 安裝

```
$ sudo curl -sL https://dl.yarnpkg.com/rpm/yarn.repo  -o /etc/yum.repos.d/yarn.repo
$ sudo yum install yarn
$ echo 'export PATH="$PATH:$(yarn global bin)"' >> ~/.bash_profile
$ source ~/.bash_profile
```

## 前置 Amplify 環境

**1. 安裝最新的 Amplify CLI**

```bash
# npm install -g @aws-amplify/cli`
yarn global add @aws-amplify/cli
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
       ![](https://hackmd.io/_uploads/BkGgzchM6.png)

    2. permission options 選擇**Attach policies directly**
       permission policies 選擇**AdministratorAccess-Amplify**
       ![](https://hackmd.io/_uploads/BkwGM5hGp.png)
    3. 確認好就可以按 Create User 囉 ↖(^ω^)↗
       ![](https://hackmd.io/_uploads/r14Vf53z6.png)
       建立成功！
       ![](https://hackmd.io/_uploads/ryNwGcnGT.png)

    4. 回到 users list 點擊剛剛建立的 user > 點擊**建立存取金鑰** > 選擇**CLI** > 下一步 > 建立存取金鑰
       ![](https://hackmd.io/_uploads/r1b3M5nGa.png)

       ![](https://hackmd.io/_uploads/SJrb79hfT.png)

    5. 接著，你就有`accessKeyId` 和 `secretAccessKey`啦～複製他們～
       ![](https://hackmd.io/_uploads/BkZUXq3G6.png)

  - [ ] 複製 IAM 中的 `accessKeyId` 和 `secretAccessKey`輸入進 CLI 中

    ```bash
    Enter the access key of the newly created user:
    ? accessKeyId:  # YOUR_ACCESS_KEY_ID
    ? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
    This would update/create the AWS Profile in your local machine
    ? Profile Name:  # (default)

    Successfully set up the new user.
    ```

    ![](https://hackmd.io/_uploads/ByzjmcnzT.png)

## 建立前端

**1. 將前端架構下載到電腦中**

```shell=
git clone https://github.com/hooroobaby/amplify-workshop.git
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

**3. 查看目前的前端有在正確的根目錄，然後啟動應用程式**

```shell=
npm start
```

應該會出現：

```
Compiled successfully!

You can now view amplify-demo in the browser.

  Local:            http://localhost:8080
  On Your Network:  http://172.31.91.142:8080

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

這時候不像平常我們在本機直接打開就好，因為在 cloud9，所以請你點擊上方列表的 Preview > **Preview Running Application**
![](https://hackmd.io/_uploads/BySh8n2Mp.png)

> 平時在你本機上 React 通常預設 port 會是 3000，所以你只要打開 http://localhost:3000 就的以看到畫面了

**就可以看到剛剛用好的前端畫面了！**
**但這個時候我們只是蓋好一間餐廳，但還沒招募廚師跟服務員，因此現在畫面上的工具都不能動。**
![](https://hackmd.io/_uploads/Bk6yPh3G6.png)

## 建立後端

**1. 初始化專案**
有了前端跟 Amplify 的環境後，我們來初始化 Amplify 專案，並建置 API

> API(Application Programming Interface)

- 1-1 首先，先在專案根目錄下初始化 Amplify 專案
  ```
  amplify init
  ```
- 1-2 接著，**除了 Choose js framework 要選擇 React 之外，其他都選擇預設就好(按 Enter 就好)**

  ```
  TeamRole:~/environment/amplify-workshop (main) $ amplify init
  Note: It is recommended to run this command from the root of your app directory
  ? Enter a name for the project amplifyworkshop
  The following configuration will be applied:

  Project information
  | Name: amplifyworkshop
  | Environment: dev
  | Default editor: Visual Studio Code
  | App type: javascript
  | Javascript framework: react
  | Source Directory Path: src
  | Distribution Directory Path: build
  | Build Command: npm run-script build
  | Start Command: npm run-script start

  ? Initialize the project with the above configuration? (Y/n)
  ```

  > <p style="color: red">這邊要注意的是‼️ 請確認Javascript framework: react這邊是react（也就是我們使用的前端框架），以免有誤！</p>
  > => **如果非react**，下面這行Initialize the project with the above configuration?請選「n」，在照這邊上面的範例修改範例

- 1-3 其餘 default

      ```
      ? Select the authentication method you want to use: AWS profile

      For more information on AWS Profiles, see:
      https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

      ? Please choose the profile you want to use default
      Adding backend environment dev to AWS Amplify app: dkyn7dwmedb1s

      Deployment completed.
      Deploying root stack amplifyworkshop [ ---------------------------------------- ] 0/4
              amplify-amplifyworkshop-dev-4… AWS::CloudFormation::Stack     CREATE_IN_PROGRESS             Mon Oct 30 2023 04:59:56…
              AuthRole                       AWS::IAM::Role                 CREATE_IN_PROGRESS             Mon Oct 30 2023 05:00:00…
              UnauthRole                     AWS::IAM::Role                 CREATE_IN_PROGRESS             Mon Oct 30 2023 05:00:00…
              DeploymentBucket               AWS::S3::Bucket                CREATE_IN_PROGRESS             Mon Oct 30 2023 05:00:00…

      ✔ Help improve Amplify CLI by sharing non-sensitive project configurations on failures (y/N) · no

      You can always opt-in by running "amplify configure --share-project-config-on"
      Deployment state saved successfully.
      ```

  **2. 新增新的 GraphQL API，API 可以將應用程式的資料同步到雲端上**

- 這邊直接全部選預設值就好（一路按 Enter）

  ```
  amplify add api
  ```

  ```
  ? Select from one of the below mentioned services: GraphQL
  ? Here is the GraphQL API that we will create. Select a setting to edit or continue Continue
  ? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)

  ✅ GraphQL schema compiled successfully.
  ```

- 編輯/amplify/backend/api/.../**schema.graphql**的內容為：

  ```
  type Song @model {
    id: ID!
    title: String!
    description: String!
    filePath: String!
    imgPath: String!
  }
  ```

  > @model 方便你 zero-effort 的建置 DynamoDB Table 與他的管理

  - id：用來辨別不同的紀錄(record)的唯一識別碼(unique identifier)
  - 除了我們訂定的欄位，真正被傳上去的還會有 createdAt（這是@model 自動生成的，代表這筆紀錄的創建時間戳記）

**3. 把 API 部署到雲端上**

```
amplify push
```

```
? Do you want to generate code for your newly created GraphQL API (Yes)
? Choose the code generation language target (javascript)
? Enter the file name pattern of graphql queries, mutations and subscriptions (src/graphql/**/*.js)
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions (Yes)
? Enter maximum statement depth [increase from default if your schema is deeply nested] (2)
```

這個指令結束後，Amplify CLI 會幫你生成兩個重要的檔案：

- aws-exports.js
- graphql/\*

**4. 加入 Storage 並部署至雲端**

```
amplify add storage && amplify push
```

```
? Select from one of the below mentioned services: Content (Images, audio, video, etc.)
✔ You need to add auth (Amazon Cognito) to your project in order to add storage for user files. Do you want to add auth now? (Y/n) · yes

Using service: Cognito, provided by: awscloudformation

 The current configured provider is Amazon Cognito.

 Do you want to use the default authentication and security configuration? Default confi
guration
 Warning: you will not be able to edit these selections.
 How do you want users to be able to sign in? Email
 Do you want to configure advanced settings? No, I am done.
✔ Provide a friendly name for your resource that will be used to label this category in the project: · s3712dfbec

✔ Provide bucket name: · amplifyworkshopf69063ba2b484a6c883118c762edca78
✔ Who should have access: · Auth and guest users
✔ What kind of access do you want for Authenticated users? · create/update, read
✔ What kind of access do you want for Guest users? · create/update, read
✔ Do you want to add a Lambda Trigger for your S3 Bucket? (y/N) · no
```

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

## 部署與託管

在專案的根目錄下，執行

```
amplify add hosting
```

**都選預設的選項就可以了**

```
? Select the plugin module to execute: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
? Choose a type: Manual Deployment
```

> 這邊選擇 Manual Deployment（手動部署），Amplify Hosting 也支援[持續部署（CD）](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html#standard)

接著 publish

```
amplify publish
```

## Cleanup

如果你想將這個專案 AWS Amplify 在 AWS 上使用的資源以及在 local 建立的檔案刪除的話，可以輸入

```shell
amplify delete
```
