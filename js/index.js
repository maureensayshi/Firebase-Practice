

function signIn() {
    let email = document.getElementById("email").value;
    window.localStorage.setItem("email",email);
    window.location = "/article.html";
}


function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        document.getElementById('submit').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    document.getElementById('submit').disabled = true;
  }

function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]
  }
// let newArticle = 
// console.log(database.once());
// let xhr = new XMLHttpRequest();
// xhr.open("get","https://app-work-team-one.firebaseio.com/",true);
// xhr.onreadystatechange = function() {
//   if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//         let res = JSON.parse(xhr.responseText);
//         console.log(res);
//   }
// }
// xhr.send();
// fetch("https://app-work-team-one.firebaseio.com/article_database", 
// { method: "get", mode: 'cors', headers: new Headers({ 'Content-Type': 'application/json' })})
// .then(res => res.json())
// .then(res => console.log(res))
// .catch(res => console.log(res))