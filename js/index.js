function signIn() {
    let email = document.getElementById("email").value;
    window.localStorage.setItem("email",email);
    alert("已登入!");
    toPage();
}


function toPage(){
  window.location = "/article.html";
}
