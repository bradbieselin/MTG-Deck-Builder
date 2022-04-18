
const filterInput = document.getElementById('filter')
filterInput.addEventListener('keyup', fetchAutoComplete)

const cardList = document.querySelector('.cardlist')

//Pass user input through autocomplete API to generate 20 cards
function fetchAutoComplete() {
    cardList.innerHTML = ``;
    fetch(`https://api.scryfall.com/cards/autocomplete?q=${filterInput.value}`)
    .then(res => res.json())
    .then(res => getCardImages(res.data))
    .then(sleeper(100))
};

//Get the image of each card generated
function getCardImages(cards) {
    cards.forEach(element => {
        fetch(`https://api.scryfall.com/cards/named?fuzzy=${element}`)
        .then(res => res.json())
        .then(card => {
            //createImages(card.name, card['image_uris'].small)
            let img = document.createElement("img");
            img.src = card['image_uris'].normal;
            img.className = "cardImage";
            cardList.append(img);
            img.addEventListener('click', (e) => handleClick(card, e))
        })
        .then(sleeper(100))
    })
};

function handleClick(card, e){
//    const details = document.querySelector('#details')
   document.querySelector('#details-image').src = card['image_uris'].normal;
   document.querySelector('#details-cardname').textContent = card.name;
   document.querySelector('#details-oracletext').textContent = card.oracle_text;
   document.querySelector('#details-powertoughness').textContent = `${card.power}/${card.toughness}`
}


//API Delay
function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }