let database = firebase.database().ref("/");
let databaseArticle = firebase.database().ref("/article_database");
let databaseUser = firebase.database().ref("/user_database");
let databaseUserAll;
let myEmailConvert;

//找到好友
databaseUser.on("value", function(snapshot){
  console.log(snapshot.val());  
  databaseUserAll = snapshot.val();  
  
  let myEmail = window.localStorage.getItem("email"); //使用者的email
  console.log(myEmail);
  myEmailConvert = myEmail.replace(/\.|@/g, "_");
  let userArray = Object.values(snapshot.val());
  console.log(userArray);
  let findMyEmail = userArray.find(function(item){
    return item.email == myEmail; 
  }) 
  console.log(findMyEmail);
  
  let myFriendArray = Object.values(findMyEmail.friends); 
  console.log(myFriendArray);
  createMyProfile(findMyEmail);

  let matchingFriendArray = myFriendArray.filter(function(item){
    return item.accept == "好友";
  });
  console.log(matchingFriendArray);   
  let friendsEmail = matchingFriendArray.map(item => item.friend_email);
  console.log(friendsEmail);
  createFriendsOptions(friendsEmail);
});

let friends;

function createMyProfile(findMyEmail){
  console.log(findMyEmail);
  //一有更心就會重刷這塊
  let myProfile = document.querySelector(".myProfile");
  while (myProfile.hasChildNodes()) {
    myProfile.removeChild(myProfile.firstChild);
  }

  let myName = document.createElement("div");
  myName.textContent = "姓名 : " + findMyEmail.name;
  let myEmail = document.createElement("div");
  myEmail.textContent = "信箱 : " + findMyEmail.email;
  myProfile.append(myName, myEmail);

  friends = findMyEmail.friends;
  console.log(friends);
  let allFriendEmail = Object.values(friends);
  console.log(allFriendEmail);

  let friendDiv = document.querySelector(".friend");
  while (friendDiv.hasChildNodes()) {
    friendDiv.removeChild(friendDiv.firstChild);
  }
  

    for(let friend in friends){
      console.log(friend);
      console.log(friends[friend].accept);
      console.log(friends[friend].friend_email);
      
      let friendEmail = document.createElement("div");
      friendEmail.textContent = friends[friend].friend_email;
      
      let friendStatus = document.createElement("div");
      friendStatus.textContent = friends[friend].accept;
      friendDiv.append(friendEmail, friendStatus);

      let buttonText;
      let buttonFunc;

      switch(friends[friend].accept){
        case "好友" : 
          buttonText = "解除好友";
          buttonFunc = (e) => deleteFriend(e);
          break;
        case "發送邀請中" : 
          buttonText = "取消邀請";
          buttonFunc = (e) => deleteFriend(e);
          break;
        case "是否接受邀請" :
          buttonText = "接受邀請";
          buttonFunc = (e) => acceptFriend(e);
          break;
      }
      let friendStatusButton = document.createElement("button");
      friendStatusButton.textContent = buttonText;
      friendDiv.appendChild(friendStatusButton);    
      friendStatusButton.onclick = function(){buttonFunc(friend)}; 
           
    }
  }

  function deleteFriend(friend) {
    console.log(databaseUserAll); //所有 user 的資料
    console.log(myEmailConvert); //我的正規表達式 email
    console.log(friend); //刪除者的正規表達式 email
    delete databaseUserAll[myEmailConvert].friends[friend];
    delete databaseUserAll[friend].friends[myEmailConvert];
    console.log(databaseUserAll);
    databaseUser.set(databaseUserAll);
  }

  function acceptFriend(friend) {
    console.log(databaseUserAll); //所有 user 的資料
    console.log(myEmailConvert); //我的正規表達式 email
    console.log(friend); //刪除者的正規表達式 email
    databaseUserAll[myEmailConvert].friends[friend].accept = "好友";
    databaseUserAll[friend].friends[myEmailConvert].accept = "好友";
    console.log(databaseUserAll);
    databaseUser.set(databaseUserAll);
  }
    
    

let newArticle = {
  article_content:"",
  article_id:"",
  article_tag:"",
  article_title:"",
  create_time:"",
  email:""
};

function submitArticle(){
  newArticle.article_title = document.querySelector(".articleTitle").value;
  newArticle.article_content = document.querySelector(".articleContent").value;    
  let Tags = document.querySelector(".articleTags");
  newArticle.article_tag = Tags.options[Tags.selectedIndex].text;
  newArticle.article_id = databaseArticle.push().getKey();
  let createNewDate = new Date();
  newArticle.create_time = createNewDate.toDateString();
  newArticle.email = window.localStorage.getItem("email");
  console.log(newArticle);
  databaseArticle.push(newArticle);
  showSubmitArticle(newArticle);
};

function showSubmitArticle(newArticle){
  let showSubmit = document.querySelector(".showSubmit");
  let articleDiv = document.createElement("div");
  let showTitle = document.createElement("div");
  showTitle.textContent = "文章標題 : " + newArticle.article_title;
  let showTime = document.createElement("div");
  showTime.textContent = "日期 : " + newArticle.create_time;
  let showTag = document.createElement("div");
  showTag.textContent = "文章分類 : " + newArticle.article_tag;
  let showEmail = document.createElement("div");
  showEmail.textContent = "作者信箱 : " + newArticle.email;
  let showContent = document.createElement("div");
  showContent.textContent = "文章內容 : " + newArticle.article_content;
  articleDiv.append(showTitle, showTime, showTag, showEmail, showContent);
  showSubmit.appendChild(articleDiv);
}

function match(){
  databaseArticle.on("value", function(snapshot){
    let FriendsOption = document.querySelector(".articleSearch");
    let FriendSelected = FriendsOption.options[FriendsOption.selectedIndex].text; //使用者選擇的好友
    console.log(FriendSelected);
    
    let TagOption = document.querySelector(".tagsSearch");
    let TagSelected =TagOption.options[TagOption.selectedIndex].text; //使用者選擇的tag
    console.log(TagSelected);
    
    let articleArray = Object.values(snapshot.val());

    if(FriendSelected != "" && TagSelected == ""){
      let mathcingFriend = articleArray.filter(function(item){
        return item.email == FriendSelected;
      });   
      showMatchedArticle(mathcingFriend);
    }
    else if(FriendSelected == "" && TagSelected != ""){
      let matchingTag = articleArray.filter(function(item){
        return item.article_tag == TagSelected;
      });
      showMatchedArticle(matchingTag);
    }
    else if(FriendSelected != "" && TagSelected != ""){
      let mathcingTagAndFriend = articleArray.filter(function(item){
        return item.email == FriendSelected && item.article_tag == TagSelected;
      })
      showMatchedArticle(mathcingTagAndFriend);
    }
  });     
}

//把好友 email 變選單的 options
function createFriendsOptions(friendsEmail){
  let selectFriend = document.querySelector(".articleSearch");
  let optionFriendDefault = document.createElement("option");
  optionFriendDefault.textContent = "";
  selectFriend.appendChild(optionFriendDefault);
  for(i = 0; i < friendsEmail.length; i++){
    let optionFriend = document.createElement("option");
    optionFriend.textContent = friendsEmail[i];
    selectFriend.appendChild(optionFriend);     
  }
};

//把文章印出來
function showMatchedArticle(matchingCondition){
  let show = document.querySelector(".show");
  show.textContent = "";
  for(i = 0; i < matchingCondition.length; i++){
    let articleDiv = document.createElement("div");
    let showTitle = document.createElement("div");
    showTitle.textContent = "文章標題 : " + matchingCondition[i].article_title;
    let showTime = document.createElement("div");
    showTime.textContent = "日期 : " + matchingCondition[i].create_time;
    let showTag = document.createElement("div");
    showTag.textContent = "文章分類 : " + matchingCondition[i].article_tag;
    let showEmail = document.createElement("div");
    showEmail.textContent = "作者信箱 : " + matchingCondition[i].email;
    let showContent = document.createElement("div");
    showContent.textContent = "文章內容 : " + matchingCondition[i].article_content;
    articleDiv.append(showTitle, showTime, showTag, showEmail, showContent);
    show.appendChild(articleDiv);
  };
};

  




  

