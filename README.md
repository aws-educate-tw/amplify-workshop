
## 工作坊成品
1. FrontEnd - React
2. Serverless BackEnd - Amplify SDK 連接 GraphQL API, DynamoDB 及 Storage(S3)
3. GraphQL API 串接前後端資料
4. AWS Amplify Deploy & Hosting

[本日實作範例網站: ](https://staging.d32o98xu01u6og.amplifyapp.com/)


# 工作坊開始
首先，開啟AWS IDE服務 - [Cloud9](https://aws.amazon.com/tw/cloud9/)
![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/75425984-ed21-4c05-b37e-5093e249d5b0)


## 確認環境
- [Node.js](https://nodejs.org/) v14.x or later
    - `node -v` 有出現版本即可
- [npm](https://www.npmjs.com/) v6.14.4 or later
  - `npm -v` 有出現版本即可
- [git](https://git-scm.com/) v2.14.1 or later
  - `git --version` 有出現版本即可


## 前置Amplify環境
**1. 安裝最新的Amplify CLI**
```bash
npm install -g @aws-amplify/cli
```
<!-- - 若失敗，可以加上Sudo 等於Windows中的系統管理員身份 -->
- -g 表示global => 在全域都可以使用

**2. 如果你想要在本地機器使用Amplify CLI，你就需要連線到AWS帳戶**
> 我們今天都是用Event Engine，所以還是要大家先配置 ( ; _ ; )/~~~
> 如果回去想自己玩玩看，且你的電腦有有憑證的AWS配置檔案，才可以跳過這個步驟喔～
```bash
amplify configure
```
- 2-1：瀏覽器會跳出「AWS登入視窗」
- 2-2：登入後，回到CLI，他會請你選擇Region跟你的AWS IAM User資料
    > AWS IAM (Identity and Access Management) 用於管理在 AWS 中的 users 和權限

    - [ ] 回到瀏覽器
    - [ ] 在AWS console中輸入IAM，創建一個user及secret key
    
        1. 輸入user name（通常會叫做`amplify-dev`，但可以輸入你喜歡的就好）> Next
           ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/08a2e6f9-a0a2-4066-a573-9a781e7ed978)


        2. permission options選擇**Attach policies directly**
            permission policies選擇**AdministratorAccess-Amplify**
            ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/5b4c00d9-da03-4e17-be52-f4f7cd8b96e5)

        3. 確認好就可以按Create User囉 ↖(^ω^)↗
            ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/57019f2a-57d5-4d0d-8f75-ac042da7ffdd)

            建立成功！
            ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/d090431a-1e8f-44c4-aa46-a3434c8f993d)


        4. 回到users list點擊剛剛建立的user >  點擊**建立存取金鑰** > 選擇**CLI** > 下一步 > 建立存取金鑰
           ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/96294613-5598-4ba6-b98c-fb1d2738ec6a)

            
           ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/2481df5f-9a79-49bf-9e69-3922771fb5bb)


        6. 接著，你就有`accessKeyId` 和 `secretAccessKey`啦～複製他們～
        ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/f9095b7b-8d72-4ba0-ae17-da76343873db)



    - [ ] 複製IAM中的 `accessKeyId` 和 `secretAccessKey`輸入進CLI中
        ```bash
        Enter the access key of the newly created user:
        ? accessKeyId:  # YOUR_ACCESS_KEY_ID
        ? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
        This would update/create the AWS Profile in your local machine
        ? Profile Name:  # (default)

        Successfully set up the new user.
        ```
        ![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/671cadc4-46a7-4cea-bcff-1063447c39a7)



## 建立前端

**1. 將前端架構下載到電腦中**
```shell=
git clone https://github.com/aws-educate-tw/amplify-workshop.git
```
**2. 下載前端會需要用到的套件**
> 套件就是「別人寫好的工具」，這個專案中下載的套件包含 Amplify 官方提供的可以使用 javascript 來操作 amplify 的工具

確認自己有在資料夾下，若沒有則輸入`cd amplify-demo`，cd 到你目前的資料夾！！！
```shell=
npm install
```

他會下載約三分鐘，下載完成後，前端就準備完成了 🎉

應該有的檔案應該有：
```
amplify-workshop
├── node_modules/
├── public/
├── src/
│   ├── components/
│   ├── App.js
│   ├── App.scss
│   └── graphql/
├── package-lock.json
└── package.json
```


**3. 查看目前的前端有在正確的根目錄，然後啟動應用程式**
```shell=
npm start
```
這時候不像平常我們在本機直接打開就好，因為在cloud9，所以請你點擊上方列表的Preview > **Preview Running Application**
![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/df0fc759-c536-4d6a-a5aa-871c8ee04fd3)



> 平時在你本機上React通常預設port會是3000，所以你只要打開 http://localhost:3000就的以看到畫面了

**就可以看到剛剛用好的前端畫面了！**
**但這個時候我們只是蓋好一間餐廳，但還沒招募廚師跟服務員，因此現在畫面上的工具都不能動。**
![image](https://github.com/aws-educate-tw/amplify-workshop/assets/73383643/4dfc64b8-0bf0-4f70-8e41-fbe5254b4147)



## 建立後端

**1. 初始化專案**
有了前端跟Amplify的環境後，我們來初始化Amplify專案，並建置API
> API(Application Programming Interface)

- 1-1 首先，先在Amplify Studio建立
 
**2. 新增新的GraphQL API，API可以將應用程式的資料同步到雲端上**
   ```
   amplify update api
   ```
    
- /amplify/backend/api/.../**schema.graphql**的內容為：

    ```
    type Song @model {
      id: ID!
      title: String!
      description: String!
      filePath: String!
      imgPath: String!
    }
    ```
    > @model方便你zero-effort的建置DynamoDB Table與他的管理
    - id：用來辨別不同的紀錄(record)的唯一識別碼(unique identifier)
    - 除了我們訂定的欄位，真正被傳上去的還會有createdAt（這是@model自動生成的，代表這筆紀錄的創建時間戳記）


**3. 加入Storage並部署至雲端**
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
若之後再有更改，都輸入此指令即可

## Cleanup
如果你想將這個專案 AWS Amplify 在 AWS 上使用的資源以及在 local 建立的檔案刪除的話，可以輸入
```shell
amplify delete
```
