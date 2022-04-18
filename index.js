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
            console.log(card)
            //createImages(card.name, card['image_uris'].small)
            let img = document.createElement("img");
            img.name = card.name;
            img.colors = card.colors;
            img.flavorText = card.flavor_text;
            img.keywords = card.keywords;
            img.src = card['image_uris'].small;
            img.className = "cardImage";
            img.artist = card.artist;
            img.oracleText = card.orcale_text;
            img.price = card.prices.usd;
            img.addEventListener("click", (e) => handleClick(e, card));
            cardList.append(img);

        })
        .then(sleeper(100))
    })
};

function handleClick(e) {
    console.log(e.target)
}

//API Delay
function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

