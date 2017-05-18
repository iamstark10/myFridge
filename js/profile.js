var config = {
  apiKey: "AIzaSyAivtwKsYOVkBxknHjMhbTIkjMj0MhSPdM",
  authDomain: "myfridge-ff976.firebaseapp.com",
  databaseURL: "https://myfridge-ff976.firebaseio.com",
  projectId: "myfridge-ff976",
  storageBucket: "myfridge-ff976.appspot.com",
  messagingSenderId: "1076830760594"
};
firebase.initializeApp(config);

var username = document.getElementById("username");
var submitbtn = document.getElementById("submitnew");
var editbtn = document.getElementById("editbtn");
var profilepic = document.getElementById("profilepic");

firebase.auth().onAuthStateChanged(firebaseUser => {



  if (firebaseUser) {
    if (firebaseUser.photoURL) {
      profilepic.src = firebaseUser.photoURL;
    }
    ref2 = firebase.database().ref('Fridge/score/' + firebaseUser.uid)
    ref2.once('value', function(childSnapshot) {
      var scoreuser = childSnapshot.val().score

      $("#pbar").css("width", scoreuser+"%")

      if(scoreuser >0 && scoreuser <=10){
        $("#rank").text("Food Youngling")
      } else if(scoreuser > 10 && scoreuser <= 25) {
        $("#rank").text("Food Padawan")
      } else if(scoreuser >25 && scoreuser <= 45){
        $("#rank").text("Food Knight")
      } else if(scoreuser >45 && scoreuser <=70){
        $("#rank").text("Food Master")
      } else if(scoreuser >70){
        $("#rank").text("Food Grand Master (GM)")
      }
    })




    username.innerHTML = firebaseUser.displayName;

    editbtn.addEventListener('click', e => {
      var newuser = document.getElementById("newuser");
      var newuserVal = newuser.value;
      newuser.value = firebaseUser.displayName;
    })

    submitbtn.addEventListener('click', e => {
      var newuser = document.getElementById("newuser");
      var photo = document.getElementById('camera');
      var newuserVal = newuser.value;
      if (newuserVal) {
        firebaseUser.updateProfile({
          displayName: newuserVal
        });
      }
      if (photo.value) {
        firebaseUser.updateProfile({
          photoURL: photo.value
        });
      }
      username.innerHTML = firebaseUser.displayName;



    });
  } else {
    console.log("not logged in");
    window.location.href="login.html"
  }
});

function readURL(input) {
  var url = input.value;
  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#img').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    $('#img').attr('src', '/assets/no_preview.png');
  }
}

function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebase.auth().signInWithRedirect(provider);
  } else {
    firebase.auth().signOut();
    window.location.href = "login.html";
  }
}
