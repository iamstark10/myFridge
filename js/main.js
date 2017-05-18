/**
 * myFridge JS
 *
 */
var gButton = document.getElementById("myButton");


/**
 * getItem
 * method when add item form button pressed.
 */
function getItem() {
  var name = document.getElementById("name").value;
  var quantity = document.getElementById("quantity").value;
  var dateTo = new Date();
  dateTo = document.getElementById("dateto").value;

  var newref = writeUserData(name, quantity, dateTo.toString());
readUserData();

}

function deleteItem(num) {
  var deletebutton = document.getElementById('delete' + num);
  var editpencil = document.getElementById('editpencil' + num);
  var user = firebase.auth().currentUser;
  var ref = firebase.database().ref('Fridge/' + user.uid)

  deletebutton.addEventListener('click', function(event) {
    itemName = document.getElementById('itemName' + num).innerHTML;
    ref.orderByChild("name").equalTo(itemName).on("child_added", function(snapshot) {
      var r = confirm("Are you sure you want to remove " + itemName + "?");
      if (r == true)
        snapshot.ref.remove();
    })
    ref2 = firebase.database().ref('Fridge/score/' + user.uid)
    ref2.once('value', function(childSnapshot) {
      try {
        var scoreuser = childSnapshot.val().score
        ref2.update({
          score: scoreuser + 1
        })
      } catch (abc) {
        ref2.update({
          score: 1
        })
      }
    })
    readUserData();
  })
  editpencil.addEventListener('click', function(event) {
    itemName = document.getElementById('itemName' + num).innerHTML;
    console.log(itemName)
  })
}

/**
 * Creates new dom element of all items of Fridge.
 */
function readUserData() {
  var node = document.getElementById("itembody");
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
  var user = firebase.auth().currentUser;
  var itemNo = 1;
  var ref = firebase.database().ref('Fridge/' + user.uid).orderByKey();
  ref.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      var tr = document.createElement('tr');
      tr.id = "itemNo" + itemNo;
      var html = "<td id=\"itemName" + itemNo + "\">" + childData.name + "</td><td id=\"" + itemNo + "\">" + childData.quantity + "</td><div class=\"progress\"><div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:100%\">" + childData.health + "</div>/div></td><div class=\"remove\"><td align=\"right\"><a><i class=\"fa fa-pencil fa-2x\" id=\"editpencil" + itemNo + "\" aria-hidden=\"true\"> |</i><i id=\"delete" + itemNo + "\"class=\"fa fa-times  fa-2x\" aria-hidden=\"true\"></i></a></td></div>"
      tr.innerHTML = html;
      document.getElementById("itembody").appendChild(tr);
      deleteItem(itemNo)
      itemNo++;

    })
  })
}



/**
 * writeUserData
 * pushes JSON object into firebase database.
 */
function writeUserData(name, quantity, health) {
  var user = firebase.auth().currentUser;
  ref = firebase.database().ref('Fridge/' + user.uid)
  if (user) {
    var justPushed = ref.push({
      name: name,
      quantity: quantity,
      health: health,
    });
    ref2 = firebase.database().ref('Fridge/score/' + user.uid)
    ref2.once('value', function(childSnapshot) {
      try {
        var scoreuser = childSnapshot.val().score
        ref2.update({
          score: scoreuser + 1
        })
      } catch (vafa) {
        ref2.update({
          score: 1
        })
      }
    })
    return justPushed;
  }
}

/**
 * Sign In/Sign Out
 * Function called when clicking the Login With Google/logout button
 */
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

/**
 * Firebase Connect
 * Initializes Firebase Application
 */
function fbConn() {
  var config = {
    apiKey: "AIzaSyAivtwKsYOVkBxknHjMhbTIkjMj0MhSPdM",
    authDomain: "myfridge-ff976.firebaseapp.com",
    databaseURL: "https://myfridge-ff976.firebaseio.com",
    projectId: "myfridge-ff976",
    storageBucket: "myfridge-ff976.appspot.com",
    messagingSenderId: "1076830760594"
  };
  firebase.initializeApp(config);
}

// Result from Redirect auth flow.
function getToken() {
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // google token @see Google API
      window.location.href = "index.html";
      var token = result.credential.accessToken;
    } else {}
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
      // If you are using multiple auth providers on your app you should handle linking
      // the user's accounts here.
    } else {
      console.error(error);
    }
  });
}

// Listening for auth state changes.
function getAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      console.log(email);

      document.getElementById("myButton").innerText = "Continue";


    } else {
      window.location.href = "login.html";
    }
  });
}

/**
 * initApp
 * FireBase setup
 */
function initApp() {
  fbConn();
  getToken();
  getAuthState();
}

window.onload = function() {
  initApp();
};