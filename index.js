const filterInput = document.getElementById('filter')
filterInput.addEventListener('input', fetchAutoComplete)

const cardList = document.querySelector('.cardlist')
const favs = document.getElementById('favs')


//Pass user input through autocomplete API to generate 20 cards
let timeOut = 0;
function fetchAutoComplete() {
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    cardList.innerHTML = ``;
    fetch(`https://api.scryfall.com/cards/autocomplete?q=${filterInput.value}`)
    .then(res => res.json())
    .then(res => getCardImages(res.data))
  }, 500)
};

//Get the image of each card generated
function getCardImages(cards) {
    cards.forEach(element => {
        fetch(`https://api.scryfall.com/cards/named?fuzzy=${element}`)
        .then(res => res.json())
        .then(card => {
            const img = document.createElement("img");
            img.src = card['image_uris'].normal;
            img.className = "cardImage";
            cardList.append(img);
            img.addEventListener('click', (e) => showDisplay(card, e))
        })
        .catch(err => console.log(err))
    })
};

//Load favorites list on page load
function renderFavorites() {
  fetch(`http://localhost:3000/favorites`)
  .then(res => res.json())
  .then(arr => arr.map(card => {
    // console.log(card)
    const img = document.createElement("img");
    img.src = card['image_uris'].normal;
    img.className = "cardImage";
    img.id = card.id
    favs.append(img);
    img.addEventListener('click', (e) => showDisplay(card, e))
    img.addEventListener('click', handleDelete)


}))}
renderFavorites();


//Display cards when clicked
function showDisplay(card, e){
  document.querySelector('#details-image').src = card['image_uris'].normal;
  document.querySelector('#details-image').obj = card
  document.querySelector('#details-cardname').textContent = card.name;
  document.querySelector('#details-oracletext').textContent = card.oracle_text;
  if(card.power){
    document.querySelector('#details-powertoughness').textContent = `Power: ${card.power} / Toughness: ${card.toughness}`
  }
  addToCartButton.style.display = 'block'
}


//Add card to favorites list when button clicked
const addToCartButton = document.querySelector('#add-to-cart')
addToCartButton.addEventListener('click', addToCart)

  function addToCart(){
    const img = document.createElement("img");
    let card = document.querySelector('#details-image').obj
    card.id = currentID +1
    img.id = card.id
    img.src = card['image_uris'].normal
    img.className = "cardImage";
    img.addEventListener('click', (e) => showDisplay(card, e))
    console.log(img.id)
    img.addEventListener('click', handleDelete)
    favs.append(img);
    postCard(card)
    currentID++
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

//button to toggle between card search and favorites list
const toggleDivsBtn = document.querySelector("#toggle-divs")
toggleDivsBtn.addEventListener('click', toggleDivs)

function toggleDivs(){
  if (toggleDivsBtn.textContent == 'View Favorites'){
    const deleteWarning = document.querySelector("delete-warning");
    toggleDivsBtn.textContent = 'Browse Cards';
    cardList.style.display = 'none';
    favs.style.display = 'grid';
    deleteButton.style.display ='block';
    deleteWarning.style.display = "block";
  } else {
    toggleDivsBtn.textContent = 'View Favorites';
    cardList.style.display = 'grid';
    favs.style.display = 'none';
    deleteButton.style.display ='none';
  }
}

//delete button
const deleteButton = document.querySelector("#delete")
deleteButton.addEventListener('click', deleteToggle)

function deleteToggle(){
  if (deleteButton.textContent == 'Click to remove items.'){
    deleteButton.textContent = 'Finish removing items.';
    document.querySelector("#delete-warning").style.color= 'red';
    document.querySelector("#delete-warning").style.display = 'block';
  } else {
    deleteButton.textContent = 'Click to remove items.';
    document.querySelector("#delete-warning").style.display = 'none';
  }
}

function handleDelete(e){
  console.log(e)
  console.log(e.target.id)
  if (deleteButton.textContent == 'Finish removing items.'){
    e.target.remove();
    deleteCard(e)
  }
}

//
function deleteCard(e){
  fetch(`http://localhost:3000/favorites/${e.target.id}`,{
    method: 'DELETE',
    headers: {
     'Content-Type': 'application/json'
    }
})}

// current id 
let currentID;
function findID() {
  fetch('http://localhost:3000/favorites/')
  .then(resp => resp.json())
  .then(arr => {
    if (arr.length > 0){
    currentID = arr[arr.length -1].id}
    else currentID =0
})}
findID()