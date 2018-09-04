let database = firebase.database().ref("/");
let databaseArticle = firebase.database().ref("/article_database");
let databaseUser = firebase.database().ref("/user_database");

function signIn() {
  let email = document.getElementById("email").value;
  window.localStorage.setItem("email",email);
  window.location = "/article.html";
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
//找到好友
databaseUser.on("value", function(snapshot){
  console.log(snapshot.val());    
  let myEmail = window.localStorage.getItem("email"); //使用者的email
  console.log(myEmail);
  let userArray = Object.values(snapshot.val());
  console.log(userArray);
  let findMyEmail = userArray.find(function(item){
    return item.email == myEmail; 
  }) 
  console.log(findMyEmail);
  let myFriendArray = Object.values(findMyEmail.friends);  
  let matchingFriendArray = myFriendArray.filter(function(item){
    return item.accept == "好友";
  });
  console.log(matchingFriendArray);   
  let friendsEmail = matchingFriendArray.map(item => item.friend_email)
  console.log(friendsEmail);
  createFriendsOptions(friendsEmail);
});

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

  




  

