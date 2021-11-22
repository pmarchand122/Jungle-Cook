// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB_TpVzd9f3GjF2SN8wrsdhSrMbvlnwMKU",
  authDomain: "jungle-cook-2312a.firebaseapp.com",
  projectId: "jungle-cook-2312a",
});
//Firestore database
var db = firebase.firestore();

//ingredient & instruction counter
var ingredientIndex = 4;
var instructionIndex = 4;

//initial ingredient array;
let ingredientArray = ["#ind1", "#ind2", "#ind3"];
//array with values of each id from the ingredientArray
let newIngredients = [];

//initial instruction array;
let instructionArray = ["#inst1", "#inst2", "#inst3"];
//array withe the values of each id from the instructionArray
let newInstructions = [];

//edited ingredient & instruction counter
let editedIngredientsIndex = 4;
let editedInstructionsIndex = 4;

let editedIngredientsArray = ["#editInd1", "#editInd2", "#editInd3"];
let newEditedIngredientArray = [];

let editedInstructionsArray = ["#editInst1", "#editInst2", "#editInst3"];
let newEditedInstructionArray = [];

let Usr = false;

function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      Usr = true;
      $("#create-recipe").css("display", "block");
      $("#your-recipe").css("display", "block");
      $("#footerCreate").css("display", "block");
      $("#footerYour").css("display", "block");
      $("#footerLogin").css("display", "none");
      $("#login").html("Logout");

      $("#login").click(function () {
        $("nav").removeClass("active");
        $("nav a.currentPage").removeClass("currentPage");
        $("#login").addClass("currentPage");
        logout();
      });
      console.log("connected");
    } else {
      Usr = false;
      $("#create-recipe").css("display", "none");
      $("#your-recipe").css("display", "none");
      $("#footerCreate").css("display", "none");
      $("#footerYour").css("display", "none");
      $("#footerLogin").css("display", "block");
      $("#login").html("Login");
      $("#login").unbind();
      $("#login").click(function () {
        $("nav").removeClass("active");
        $("nav a.currentPage").removeClass("currentPage");
        $("#login").addClass("currentPage");
      });

      console.log("not connected");
    }
  });
}

function changeFooter() {
  if (Usr) {
    $("#footerCreate").css("display", "block");
    $("#footerLogin").css("display", "none");
    $("#footerYour").css("display", "block");
  } else {
    $("#footerCreate").css("display", "none");
    $("#footerLogin").css("display", "block");
    $("#footerYour").css("display", "none");
  }
}

function submitEdit(id) {
  let ID = id.replace("submit", "");
  console.log(ID);
  let newName = $("#editName").val();
  let newDesc = $("#editDesc").val();
  let newTime = $("#editTotalTime").val();
  let newServings = $("#editServingSize").val();
  editedIngredientsArray.forEach((ingredient) => {
    if ($(`${ingredient}`).val() == "") {
      return;
    } else {
      newEditedIngredientArray.push($(`${ingredient}`).val());
    }
  });
  editedInstructionsArray.forEach((instruction) => {
    if ($(`${instruction}`).val() == "") {
      return;
    } else {
      newEditedInstructionArray.push($(`${instruction}`).val());
    }
  });

  db.collection("recipes")
    .doc(ID)
    .set({
      name: newName,
      desc: newDesc,
      time: newTime,
      servings: newServings,
      ingredients: newEditedIngredientArray,
      instructions: newEditedInstructionArray,
    })
    .then(() => {
      window.alert("You have edited your recipe!");
    })
    .catch((error) => {
      window.alert(error);
    });
}

function editRecipe(iD) {
  changeFooter();
  db.collection("recipes")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let info = doc.data();
        let ID = doc.id;
        if (ID == iD) {
          $("#submitHolder")
            .html(` <div id="submit${ID}" class="submitEditButton" onclick="submitEdit(id)">
            <span class="submit">Submit Edited Recipe</span>
            </div>`);
          $("#editName").attr("placeholder", "Change Recipe Name");
          $("#editDesc").attr("placeholder", "Change Recipe Description");
          $("#editTotalTime").attr("placeholder", "Change Recipe Time");
          $("#editServingSize").attr(
            "placeholder",
            "Change Recipe Serving Size"
          );
          $("#editInd1").attr("placeholder", `Change Ingredient 1`);
          $("#editInd2").attr("placeholder", `Change Ingredient 2`);
          $("#editInd3").attr("placeholder", `Change Ingredient 3`);
          $("#editInst1").attr("placeholder", `Change Instruction 1`);
          $("#editInst2").attr("placeholder", `Change Instruction 2`);
          $("#editInst3").attr("placeholder", `Change Instruction 3`);
        } else {
          return;
        }
      });
    });
}

function addRecipeView(iD) {
  changeFooter();
  db.collection("recipes")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let info = doc.data();
        let ID = doc.id;
        console.log(doc.id);
        if (ID == iD) {
          $("#newRecipeName").html(info.name);
          $("#newRecipeDesc").html(info.desc);
          $("#newRecipeTime").html(info.time);
          $("#newRecipeServings").html(info.servings);
          info.ingredients.forEach((ingredient) => {
            $(".ingredientsList").append(`<p>${ingredient}</p>`);
          });
          info.instructions.forEach((instruction) => {
            $(".instructionsList").append(`<p>${instruction}</p>`);
          });
          $(".editButton").html(
            `<a id="${doc.id}" onclick="editRecipe(id)" href="#/change">Edit</a>`
          );
        } else {
          return;
        }
      });
    });
}

function createRecipe() {
  let recipeName = $("#recipeName").val();
  let recipeDesc = $("#recipeDesc").val();
  let recipeTotalTime = $("#recipeTotalTime").val();
  let recipeServingSize = $("#recipeServingSize").val();

  for (var i = 0; i < ingredientArray.length; i++) {
    newIngredients.push($(`${ingredientArray[i]}`).val());
  }
  for (var i = 0; i < instructionArray.length; i++) {
    newInstructions.push($(`${instructionArray[i]}`).val());
  }

  db.collection("recipes")
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length >= 4) {
        window.alert("You have too many recipes");
      } else {
        db.collection("recipes")
          .add({
            name: recipeName,
            time: recipeTotalTime,
            servings: recipeServingSize,
            desc: recipeDesc,
            image: "pizza",
            ingredients: newIngredients,
            instructions: newInstructions,
          })
          .then((docRef) => {
            console.log("Document writtentwith ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

        window.alert("You have created a new recipe.");
      }
    });
}

function deleteRecipe(iD) {
  let ID = iD.replace("delete", "");
  console.log(ID);
  db.collection("recipes")
    .doc(ID)
    .delete()
    .then(() => {
      MODEL.getPageContent("your", appendRecipe);
    });
}

function appendRecipe() {
  changeFooter();
  db.collection("recipes")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let info = doc.data();
        $(".yourRecipes").append(`<div class="yourRecipe">
    <div class="main">
      <div class="pizza">
        <a id="${doc.id}" onclick="addRecipeView(id)" href="#/new">View</a>
      </div>
      <div class="recipeDetails">
        <div class="textHolder">
          <h1>${info.name}</h1>
          <p>${info.desc}</p>
          <div class="metaDetail">
            <img src="../../images/time.svg" />
            <p>${info.time}</p>
          </div>
          <div class="metaDetail">
            <img src="../../images/servings.svg" />
            <p>${info.servings} servings</p>
          </div>
        </div>
      </div>
    </div>
    <div class="udButtons">
    <a id="${doc.id}" onclick="editRecipe(id)" href="#/change">Edit</a>
    <p id="delete${doc.id}" onclick="deleteRecipe(id)">Delete</p>

    </div>
  </div>`);
      });
    });

  newInstructions = [];
  newIngredients = [];
}

function updateSiteWithInfo() {
  let user = firebase.auth().currentUser;
  console.log(user);
}

function loadRecipes() {
  $.getJSON("data/data.json", function (data) {
    $.each(data.PUBLIC_RECIPES, function (index, recipe) {
      $(".browseRecipes").append(`
      <div class="recipe">
      <div class="${recipe.class}"></div>
      <div class="recipeDetails">
        <div class="textHolder">
          <h1>${recipe.name}</h1>
          <p>
            ${recipe.desc}
          </p>
          <div class="metaDetail">
            <img src="../../images/time.svg" />
            <p>${recipe.time}</p>
          </div>
          <div class="metaDetail">
            <img src="../../images/servings.svg" />
            <p>${recipe.servings} servings</p>
          </div>
        </div>
      </div>
    </div>
      `);
      console.log(recipe);
    });
  }).fail(function (jqxhr, textStatus, error) {
    console.log(jqxhr, textStatus, error);
  });
}

function mobileNav() {
  $("mobile-nav, i").click(function (e) {
    $("nav").toggleClass("active");
  });
}

function route() {
  let hashTag = window.location.hash;
  let pageName = hashTag.replace("#/", "");

  if (pageName === "") {
    MODEL.getPageContent("home", changeFooter);
  } else if (pageName === "browse") {
    MODEL.getPageContent("browse", changeFooter);
    loadRecipes();
  } else if (pageName === "your") {
    MODEL.getPageContent("your", appendRecipe);
  } else if (pageName === "new") {
    MODEL.getPageContent("new", addRecipeView);
  } else if (pageName === "change") {
    MODEL.getPageContent("change", editRecipe);
  } else {
    MODEL.getPageContent(pageName, firebaseListeners);
  }
}

function loginUser() {
  let password = $("#password").val();
  let email = $("#email").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      window.alert("Signed In");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
}

function addIngred() {
  let input = `<input id="ind${ingredientIndex}" type="text" placeholder="Ingredient ${ingredientIndex}" />`;
  $(".ingredients").append(input);
  ingredientArray.push(`#ind${ingredientIndex}`);
  console.log(ingredientArray);
  ingredientIndex++;
}

function addInstruction() {
  let input = `<input id="inst${instructionIndex}" type="text" placeholder="Instruction ${instructionIndex}" />`;
  $(".instructions").append(input);
  instructionArray.push(`#inst${instructionIndex}`);
  console.log(instructionArray);
  instructionIndex++;
}

function addIngredToEdit() {
  let input = `<input id="editInd${editedIngredientsIndex}" type="text" placeholder="Change Ingredient ${editedIngredientsIndex}" />`;
  $(".editIngredients").append(input);
  editedIngredientsArray.push(`#editInd${editedIngredientsIndex}`);
  editedIngredientsIndex++;
}

function addInstructionToEdit() {
  let input = `<input type="text" id="editInst${editedInstructionsIndex}" placeholder="Change Instruction ${editedInstructionsIndex}" />`;
  $(".editInstructions").append(input);
  editedInstructionsArray.push(`#editInst${editedInstructionsIndex}`);
  editedInstructionsIndex++;
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      window.alert("You have signed out");
    })
    .catch((error) => {
      console.log(error);
      window.alert(error);
    });
}

function signupUser() {
  console.log("signup");
  let password = $("#signupPassword").val();
  let email = $("#signupEmail").val();
  let firstName = $("#firstName").val();
  let lastName = $("#lastName").val();

  fullName = firstName + " " + lastName;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log(user);
      window.alert("User has signed up!");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function firebaseListeners() {
  changeFooter();
  $("button").click(function (e) {
    console.log("clicked");
    e.preventDefault();
    let btnID = e.currentTarget.id;
    if (btnID == "submitSignUp") {
      signupUser();
    } else if (btnID == "submitLogin") {
      loginUser();
    }
  });
}

function initListeners() {
  $(window).on("hashchange", route);

  route();
}

$(document).ready(function () {
  mobileNav();
  initListeners();
  try {
    let app = firebase.app();
    initFirebase();
  } catch {
    console.log(e);
    console.log(errorMessage);
  }
});
