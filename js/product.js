const productId = window.location.search;
const urlParams = new URLSearchParams(productId);
const OursonId = urlParams.get('id');
const url = "http://localhost:3000/api/teddies";
const getProduct = `${url}/${OursonId}`;
console.log(productId);
console.log(urlParams);
console.log(OursonId);
document.addEventListener('DOMContentLoaded', ()=>{
    CART.Init();
})

let textBouton = document.querySelector("#panier > p");
let svgBouton = document.querySelector("#panier > svg");

function createProduct(value) {
    var imgSrc = document.getElementById('image_produit');
    var name = document.getElementById('name_produit');
    var desc = document.getElementById('description_produit');
    var price = document.getElementById('price_produit');
    var button = document.getElementById('panier');
    var price_produit = value.price/100;


    name.innerText = `${value.name}`;
    desc.innerText = `${value.description}`;
    price.innerText = `${price_produit.toFixed(2)} €`;
    imgSrc.src = `${value.imageUrl}`;

    button.setAttribute('productId', value._id);
    button.addEventListener('click', addItem);


    function addItem(ev){
        console.log(button.getAttribute(('productId')));
        ev.preventDefault();
        let id = ev.currentTarget.getAttribute('productId');
        console.log(id);
        let Qty = document.getElementById("qty").value;
        console.log(`Ajout de l'ourson ${id} au panier en ${Qty} exemplaires`);
        CART.add(value, Qty);
        svgBouton.style.display = 'none';
        textBouton.innerText = `Ajout de l'ourson au panier en ${Qty} exemplaires`
        setTimeout(function(){
            textBouton.innerText = "Ajouter au panier"; 
            svgBouton.style.display = 'initial';
        }, 2000);
    
    }
    
}

function couleur(value) {
    for (let i=0; i<value.colors.length; i++)
     {
        document.getElementById('couleur').innerHTML += 
        `
        <option value="coul${i}">${value.colors[i]}</option>          
    `
}
};

fetch(getProduct) 
    .then(
        (response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Ourson introuvable');
            }
        },
        (networkError) => {
            console.log(networkError.message);
            status.innerText = "Error";
        }
    )
    .then((jsonResponse) => {
        createProduct(jsonResponse);
        couleur(jsonResponse);
    }
 
    )





