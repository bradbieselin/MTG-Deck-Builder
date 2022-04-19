const filterInput = document.getElementById('filter')
filterInput.addEventListener('input', fetchAutoComplete)

const cardList = document.querySelector('.cardlist')
const favs = document.getElementById('favs')

//Pass user input through autocomplete API to generate 20 cards
function fetchAutoComplete() {
    cardList.innerHTML = ``;
    fetch(`https://api.scryfall.com/cards/autocomplete?q=${filterInput.value}`)
    .then(res => res.json())
    .then(res => getCardImages(res.data))
    .then(sleeper(1000))
};

//Get the image of each card generated
function getCardImages(cards) {
    cards.forEach(element => {
        fetch(`https://api.scryfall.com/cards/named?fuzzy=${element}`)
        .then(res => res.json())
        .then(card => {
            //createImages(card.name, card['image_uris'].small)
            const img = document.createElement("img");
            img.src = card['image_uris'].normal;
            img.className = "cardImage";
            cardList.append(img);
            img.addEventListener('click', (e) => showDisplay(card, e))
        })
        .catch(err => console.log(err))
        .then(sleeper(1000))
    })
};

function initialize() {
    fetch(`http://localhost:3000/favorites`)
    .then(res => res.json())
    .then(arr => arr.map(card => {
        console.log(card)
        const img = document.createElement("img");
        img.src = card['image_uris'].normal;
        img.className = "cardImage";
        favs.append(img);
        img.addEventListener('click', (e) => showDisplay(card, e))
}))}
initialize();

function showDisplay(card, e){
//    const details = document.querySelector('#details')
  document.querySelector('#details-image').src = card['image_uris'].normal;
  document.querySelector('#details-image').obj = card
  document.querySelector('#details-cardname').textContent = card.name;
  document.querySelector('#details-oracletext').textContent = card.oracle_text;
  if(card.power){
    document.querySelector('#details-powertoughness').textContent = `Power: ${card.power} / Toughness: ${card.toughness}`
  }
  addToCartButton.style.display = 'block'
}

//API Delay
function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => {
        console.log("sleeper") 
        resolve(x);
      }, ms));
    };
  }

const addToCartButton = document.querySelector('#add-to-cart')
addToCartButton.addEventListener('click', addToCart)

  function addToCart(){
    // post to db
    // add to favs div
    const img = document.createElement("img");
    let card = document.querySelector('#details-image').obj
    img.src = card['image_uris'].normal
    img.className = "cardImage";
    img.addEventListener('click', (e) => showDisplay(card, e))
    favs.append(img);
    
    postCard(card)
}

//takes obj and posts to database
function postCard(obj){
  fetch('http://localhost:3000/favorites',{
    method: 'POST',
    headers: {
     'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
}

//button to toggle divs.
const toggleDivsBtn = document.querySelector("#toggle-divs")
toggleDivsBtn.addEventListener('click', toggleDivs)

function toggleDivs(){
  if (toggleDivsBtn.textContent == 'View Favorites.'){
    toggleDivsBtn.textContent = 'Browse Cards.'
    cardList.style.display = 'none'
    favs.style.display = 'grid'
  } else {
    toggleDivsBtn.textContent = 'View Favorites.'
    cardList.style.display = 'grid'
    favs.style.display = 'none'
  }
}

//delete button