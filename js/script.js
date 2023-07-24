// Retrieving the card container from the DOM
let cardContainer = document.getElementById('container');

// Event listener attached to the window to execute the code when the page is loaded
window.addEventListener("load", function () {
     // Getting the favoriteCharacters array from localStorage
     let favorites = localStorage.getItem("favoriteCharacters");

     // If favorites is null, display a message and return
     if (favorites == null) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>";
          return;
     }
     // If favorites is not null, parse it to convert it into an array
     else {
          favorites = JSON.parse(localStorage.getItem("favoriteCharacters"));
     }

     // If all the characters are deleted from favorites and there are no characters left to display
     if (favorites.length === 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>";
          return;
     }

     cardContainer.innerHTML = "";
     favorites.forEach(character => {
          cardContainer.innerHTML +=
               `
               <div class="flex-col card">
                    <img src="${character.squareImage}" alt="">
                    <span class="name">${character.name}</span>
                    <span class="id">Id : ${character.id}</span>
                    <span class="comics">Comics : ${character.comics}</span>
                    <span class="series">Series : ${character.series}</span>
                    <span class="stories">Stories : ${character.stories}</span>
                    <a class="character-info" href="./more-info.html">
                         <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button>
                    </a>
                    <div style="display:none;">
                         <span>${character.id}</span>
                         <span>${character.name}</span>
                         <span>${character.comics}</span>
                         <span>${character.series}</span>
                         <span>${character.stories}</span>
                         <span>${character.description}</span>
                         <span>${character.landscapeImage}</span>
                         <span>${character.portraitImage}</span>
                         <span>${character.squareImage}</span>
                    </div>
                    <button class="btn remove-btn"><i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favorites</button>
               </div>
          `;
     });
     // Adding appropriate event listeners to the buttons after they are inserted into the DOM
     addEvent();
});

// Function for attaching event listeners to buttons
function addEvent() {
     let removeBtn = document.querySelectorAll(".remove-btn");
     removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavorites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
}

function removeCharacterFromFavorites() {
     // Storing the ID of the character to be deleted in a variable
     let idOfCharacterToBeDeleted = this.parentElement.children[2].innerHTML.substring(5);

     // Getting the favorites array that stores objects of characters
     let favorites = JSON.parse(localStorage.getItem("favoriteCharacters"));
     // favoritesCharacterIDs is taken from localStorage for deleting the ID of the character that is deleted from favorites
     let favoritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favoritesCharacterIDs")));
     // Deleting the character's ID from favoritesCharacterIDs map
     favoritesCharacterIDs.delete(`${idOfCharacterToBeDeleted}`);

     // Deleting the character from the array whose ID matches
     favorites.forEach(function (favorite, index) {
          if (favorite.id == idOfCharacterToBeDeleted) {
               favorites.splice(index, 1);
          }
     });

     // If all the characters are deleted from favorites and there are no characters left to display
     if (favorites.length === 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favorites</p>";
     }

     // Updating the new arrays in localStorage
     localStorage.setItem("favoriteCharacters", JSON.stringify(favorites));
     localStorage.setItem("favoritesCharacterIDs", JSON.stringify([...favoritesCharacterIDs]));

     // Removing the element from the DOM
     this.parentElement.remove();

     // Displaying the "Removed from favorites" toast in the DOM
     document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");
     // Removing the "Removed from favorites" toast from the DOM
     setTimeout(function () {
          document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide");
     }, 1000);
}

// Function that stores the info object of the character for which the user wants to see the info
function addInfoInLocalStorage() {
     // This function basically stores the data of the character in localStorage.
     // When the user clicks on the info button and the info page is opened, that page fetches the heroInfo and displays the data
     let heroInfo = {
          name: this.parentElement.children[7].children[1].innerHTML,
          description: this.parentElement.children[7].children[5].innerHTML,
          comics: this.parentElement.children[7].children[2].innerHTML,
          series: this.parentElement.children[7].children[3].innerHTML,
          stories: this.parentElement.children[7].children[4].innerHTML,
          portraitImage: this.parentElement.children[7].children[7].innerHTML,
          id: this.parentElement.children[7].children[0].innerHTML,
          landscapeImage: this.parentElement.children[7].children[6].innerHTML
     };

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

// Theme Changing

// Selection of theme button
let themeButton = document.getElementById("theme-btn");

themeButton.addEventListener("click", themeChanger);

// IIFE function which checks the localStorage and applies the previously set theme
(function () {
     let currentTheme = localStorage.getItem("theme");
     if (currentTheme == null) {
          root.setAttribute("color-scheme", "light");
          themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
          themeButton.style.backgroundColor = "#0D4C92";
          localStorage.setItem("theme", "light");
          return;
     }

     switch (currentTheme) {
          case "light":
               root.setAttribute("color-scheme", "light");
               themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
               themeButton.style.backgroundColor = "#0D4C92";
               break;
          case "dark":
               root.setAttribute("color-scheme", "dark");
               themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
               themeButton.style.backgroundColor = "#FB2576";
               themeButton.childNodes[0].style.color = "black";
               break;
     }
})();

// Function for handling theme button changes
function themeChanger() {
     let root = document.getElementById("root");
     if (root.getAttribute("color-scheme") == "light") {
          root.setAttribute("color-scheme", "dark");
          themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
          themeButton.style.backgroundColor = "#FB2576";
          themeButton.childNodes[0].style.color = "black";
          localStorage.setItem("theme", "dark");
     } else if (root.getAttribute("color-scheme") == "dark") {
          root.setAttribute("color-scheme", "light");
          themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
          themeButton.style.backgroundColor = "#0D4C92";
          themeButton.childNodes[0].style.color = "white";
          localStorage.setItem("theme", "light");
     }
}
