// Retrieve DOM elements
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Add event listener to the search bar
searchBar.addEventListener("input", () => searchHeroes(searchBar.value));

// Function to search superheroes using the Marvel API
async function searchHeroes(searchText) {
    if (searchText.length === 0) {
        searchResults.innerHTML = ``;
        return;
    }

    // Marvel API credentials
    const PUBLIC_KEY = "5034563621fa2511fc3a1badc87481c4";
    const PRIVATE_KEY = "fec57671b7ca7cc19b95191ef7718c65399be1d2";
    const timestamp = new Date().getTime();
    const hash = "d35377547e551cd64a60657d2517bb7f"; // MD5 hash

    try {
        // Fetch data from the Marvel API using the provided search text, public key, hash, and timestamp
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchText}&apikey=${PUBLIC_KEY}&hash=${hash}&ts=${timestamp}`);
        const data = await response.json();

        // Display the search results
        showSearchResults(data.data.results);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to display the search results in the DOM
function showSearchResults(heroes) {
    searchResults.innerHTML = ``;
    let count = 1;

    // Loop through the searched heroes and display up to 5 results
    for (const hero of heroes) {
        if (count > 5) break;

        // Create HTML elements to display each superhero's information
        searchResults.innerHTML +=
            `
            <li class="flex-row single-search-result">
                <div class="flex-row img-info">
                    <img src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="">
                    <div class="hero-info">
                        <a class="character-info" href="./more-info.html">
                            <span class="hero-name">${hero.name}</span>
                        </a>
                    </div>
                </div>
                <div class="flex-col buttons">
                    <button class="btn add-to-fav-btn">${getFavButtonIcon(hero.id)} &nbsp; ${getFavButtonText(hero.id)}</button>
                </div>
                <div style="display:none;">
                    <span>${hero.name}</span>
                    <span>${hero.description}</span>
                    <span>${hero.comics.available}</span>
                    <span>${hero.series.available}</span>
                    <span>${hero.stories.available}</span>
                    <span>${hero.thumbnail.path + '/portrait_uncanny.' + hero.thumbnail.extension}</span>
                    <span>${hero.id}</span>
                    <span>${hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension}</span>
                    <span>${hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension}</span>
                </div>
            </li>
        `;

        count++;
    }

    // Attach events to the buttons after they are inserted in the DOM
    attachButtonEvents();
}

// Function to attach event listeners to buttons
function attachButtonEvents() {
    let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
    favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

    let characterInfo = document.querySelectorAll(".character-info");
    characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
}

// Function invoked when "Add to Favourites" or "Remove from Favourites" button is clicked, appropriate action is taken based on the button clicked
function addToFavourites() {
    // Get the hero ID of the character to be added/removed
    let heroId = this.parentElement.parentElement.children[2].children[6].innerHTML;

    // Get the favouritesCharacterIDs from localStorage
    let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

    if (!favouritesCharacterIDs.has(heroId)) {
        // If the character ID is not in favourites, add it
        favouritesCharacterIDs.set(heroId, true);
        addToFavouritesArray(heroId);
        this.innerHTML = `<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites`;

        // Show "Added to Favourites" toast
        showToast("Added to Favourites");
    } else {
        // If the character ID is in favourites, remove it
        favouritesCharacterIDs.delete(heroId);
        removeFromFavouritesArray(heroId);
        this.innerHTML = `<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites`;

        // Show "Remove from Favourites" toast
        showToast("Removed from Favourites");
    }

    // Save the updated favouritesCharacterIDs in localStorage
    localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
}

// Function to add the character info to the favourites array in localStorage
function addToFavouritesArray(heroId) {
    let heroInfo = {
        name: this.parentElement.parentElement.children[2].children[0].innerHTML,
        description: this.parentElement.parentElement.children[2].children[1].innerHTML,
        comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
        series: this.parentElement.parentElement.children[2].children[3].innerHTML,
        stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
        portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
        id: heroId,
        landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
        squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
    };

    // Get the current favourites array from localStorage
    let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];
    favouritesArray.push(heroInfo);

    // Save the updated favourites array in localStorage
    localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
}

// Function to remove the character from the favourites array in localStorage
function removeFromFavouritesArray(heroId) {
    // Get the current favourites array from localStorage
    let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];

    // Filter out the character with the specified ID
    favouritesArray = favouritesArray.filter((hero) => hero.id !== heroId);

    // Save the updated favourites array in localStorage
    localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
}

// Function to display a toast message for adding/removing from favourites
function showToast(message) {
    let toast = document.querySelector(`.${message.toLowerCase()}-toast`);
    toast.setAttribute("data-visibility", "show");
    setTimeout(() => {
        toast.setAttribute("data-visibility", "hide");
    }, 1000);
}

// Function to store the character info in localStorage when the user wants to see more info
function addInfoInLocalStorage() {
    let heroInfo = {
        name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
        description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
        comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
        series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
        stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
        portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
        id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
        landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
        squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
    };

    localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

// Function to toggle between light and dark theme
function themeChanger() {
    let root = document.getElementById("root");
    let themeButton = document.getElementById("theme-btn");
    let currentTheme = localStorage.getItem("theme");

    if (currentTheme == "light") {
        root.setAttribute("color-scheme", "dark");
        themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        themeButton.style.backgroundColor = "#FB2576";
        themeButton.childNodes[0].style.color = "black";
        localStorage.setItem("theme", "dark");
    } else if (currentTheme == "dark") {
        root.setAttribute("color-scheme", "light");
        themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        themeButton.style.backgroundColor = "#0D4C92";
        themeButton.childNodes[0].style.color = "white";
        localStorage.setItem("theme", "light");
    }
}

// Attach event listener to the theme button
let themeButton = document.getElementById("theme-btn");
themeButton.addEventListener("click", themeChanger);
