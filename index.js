/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    for (let game of games) {
        // create a new div element, which will become the game card
        let gameCard = document.createElement('div');

        // add the class 'game-card' to the game card's class list
        gameCard.classList.add('game-card');

        // set the inner HTML of the game card using a template literal
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-img"/>
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>Pledged: $${game.pledged.toLocaleString()}</p>
                <p>Backers: ${game.backers}</p>
            </div>`;

        // append the game card to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

addGamesToPage(GAMES_JSON);
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/



// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => accumulator + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `Total Contributions: ${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// Calculate the total amount raised (pledged) across all games
const totalRaised = GAMES_JSON.reduce((accumulator, game) => accumulator + game.pledged, 0);

// set inner HTML of raisedCard to display the total amount raised with a dollar sign
raisedCard.innerHTML = `Total Amount Raised: $${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

// Calculate the number of games
const numberOfGames = GAMES_JSON.length;

// Update the number of games card element with the total number of games
gamesCard.innerHTML = `Number of Games: ${numberOfGames}`;




/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add funded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);





/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/
// Assuming you have variables to store the total money raised and total games
const totalMoneyRaised = 50000;
const totalGames = 10;

// Use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.reduce((count, game) => {
    return game.funded ? count : count + 1;
}, 0);

// Create a string to explain the number of unfunded games using the ternary operator
const unfundedGamesDescription = unfundedGamesCount === 1 ?
    "There is 1 unfunded game." :
    `There are ${unfundedGamesCount} unfunded games.`;

const fundraisingInfo = `We have raised $${totalMoneyRaised} for ${totalGames} games. ${unfundedGamesDescription}`;


const descriptionContainer = document.getElementById("description-container");
descriptionContainer.textContent = fundraisingInfo;


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});


// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...restOfGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameNameElement = document.createElement("div");
firstGameNameElement.textContent = `1st Place: ${firstGame.name}`;

// do the same for the runner up item
const secondGameNameElement = document.createElement("div");
secondGameNameElement.textContent = `2nd Place: ${secondGame.name}`;

// Appending rest games to their containers
firstGameContainer.appendChild(firstGameNameElement);
secondGameContainer.appendChild(secondGameNameElement);

//Search feature
// JavaScript code
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResultsContainer = document.getElementById("search-results");

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("input", performSearch);

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Logic to filter and display search results based on the searchTerm
    const searchResults = GAMES_JSON.filter(game => {
        return game.name.toLowerCase().includes(searchTerm);
    });
    
    // Display search results
    displaySearchResults(searchResults);
    
    // Check if the search term is empty, and if so, clear the search results container
    if (searchTerm === "") {
        searchResultsContainer.innerHTML = "";
    }
}



function displaySearchResults(results) {
    // Clear previous search results
    searchResultsContainer.innerHTML = "";
    
    // Check if there are any search results
    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
    } else {
        // Loop through the search results and create elements to display them
        results.forEach(result => {
            const gameDiv = document.createElement("div");
            gameDiv.classList.add("search-result");
            
            const gameName = document.createElement("h3");
            gameName.textContent = result.name;
            
            const gameDescription = document.createElement("p");
            gameDescription.textContent = result.description;
            
            gameDiv.appendChild(gameName);
            gameDiv.appendChild(gameDescription);
            
            searchResultsContainer.appendChild(gameDiv);
        });
    }
}

