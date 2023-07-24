// API keys (Replace these with your Marvel API keys)
const publicKey = 'YOUR_PUBLIC_KEY';
const privateKey = 'YOUR_PRIVATE_KEY';

// API Base URL
const baseURL = 'https://gateway.marvel.com:443/v1/public';

// Function to generate the MD5 hash
function generateMD5Hash(value) {
  return MD5(value).toString();
}

// Function to fetch superheroes data from the Marvel API
async function fetchSuperheroes(searchQuery) {
  const timestamp = new Date().getTime();
  const hash = generateMD5Hash(timestamp + privateKey + publicKey);
  const url = `${baseURL}/characters?ts=${timestamp}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error('Error fetching superheroes:', error);
    return [];
  }
}

// Function to display superheroes list on the Home Page
function displaySuperheroes(superheroes) {
  const superheroesList = document.getElementById('superheroesList');
  superheroesList.innerHTML = '';

  superheroes.forEach(superhero => {
    const superheroDiv = document.createElement('div');
    superheroDiv.classList.add('superhero-card');

    const superheroName = document.createElement('h3');
    superheroName.textContent = superhero.name;

    const superheroImage = document.createElement('img');
    superheroImage.src = `${superhero.thumbnail.path}/portrait_medium.${superhero.thumbnail.extension}`;
    superheroImage.alt = superhero.name;

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Favorite';
    favoriteButton.addEventListener('click', () => addToFavorites(superhero));

    superheroDiv.appendChild(superheroName);
    superheroDiv.appendChild(superheroImage);
    superheroDiv.appendChild(favoriteButton);

    superheroesList.appendChild(superheroDiv);
  });
}

// Function to handle the search input
async function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    const superheroes = await fetchSuperheroes(searchQuery);
    displaySuperheroes(superheroes);
  }
}

// Function to add a superhero to "My Favourite Superheroes" list
function addToFavorites(superhero) {
  const favouritesList = document.getElementById('favouritesList');
  const superheroLi = document.createElement('li');
  superheroLi.textContent = superhero.name;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove from Favorites';
  removeButton.addEventListener('click', () => removeFromFavorites(superheroLi));

  superheroLi.appendChild(removeButton);
  favouritesList.appendChild(superheroLi);
}

// Function to remove a superhero from "My Favourite Superheroes" list
function removeFromFavorites(superheroLi) {
  const favouritesList = document.getElementById('favouritesList');
  favouritesList.removeChild(superheroLi);
}

// Event listener for the search input
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Function to navigate to the Superhero Page and display superhero details
function showSuperheroDetails(superhero) {
  const homePage = document.getElementById('homePage');
  const superheroPage = document.getElementById('superheroPage');
  const superheroName = document.getElementById('superheroName');
  const superheroImage = document.getElementById('superheroImage');
  const superheroBio = document.getElementById('superheroBio');

  homePage.style.display = 'none';
  superheroPage.style.display = 'block';

  superheroName.textContent = superhero.name;
  superheroImage.src = `${superhero.thumbnail.path}/portrait_xlarge.${superhero.thumbnail.extension}`;
  superheroBio.textContent = superhero.description || 'No description available.';
}

// Event listener for each superhero card to show superhero details
document.getElementById('superheroesList').addEventListener('click', event => {
  const superheroCard = event.target.closest('.superhero-card');
  if (superheroCard) {
    const superheroName = superheroCard.querySelector('h3').textContent;
    const superhero = superheroes.find(s => s.name === superheroName);
    showSuperheroDetails(superhero);
  }
});

// Function to navigate back to the Home Page from the Superhero Page
function goBackToHomePage() {
  const homePage = document.getElementById('homePage');
  const superheroPage = document.getElementById('superheroPage');

  homePage.style.display = 'block';
  superheroPage.style.display = 'none';
}

// Event listener for the "Back to Home" button on the Superhero Page
document.getElementById('backToHomeButton').addEventListener('click', goBackToHomePage);
