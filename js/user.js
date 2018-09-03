let database = firebase.database().ref("/");

database.on("value", function(snapshot){
  let val = snapshot.val();
  console.log(val);
});

