//REQUETE FETCH ET AFFICHAGE DU PRODUIT

//Récupération de l'ID du produit que l'on souhaite afficher dans les paramètres de l'url
const productId = window.location.search;
const urlParams = new URLSearchParams(productId);
const OursonId = urlParams.get('id');

//Création de l'url de requête serveur pour la requête fetch
const url = "http://localhost:3000/api/teddies";
const getProduct = `${url}/${OursonId}`;

//Initialisation de la variable cartContent qui correspond au contenu du panier
let cartContent = [];

//Récupération des blocs HTML qui seront utiles à la création du message d'ajout au panier
let textBouton = document.querySelector("#panier > p");
let svgBouton = document.querySelector("#panier > svg");

//Fonction qui affiche le produit sur le site en remplissant la fiche produit HTML avec les infos récupérées dans la requête fetch
function createProduct(value) {
    //Récupération des blocs HTML où chaque info s'affichera
    var imgSrc = document.getElementById('image_produit');
    var name = document.getElementById('name_produit');
    var desc = document.getElementById('description_produit');
    var price = document.getElementById('price_produit');
    var button = document.getElementById('panier');
    var price_produit = value.price/100; //Mise en forme du prix du produit

    //Remplissage des blocs HTML avec les informations entrées en paramètres dans la fonction, c'est-à-dire la réponse de la requête fetch
    name.innerText = `${value.name}`;
    desc.innerText = `${value.description}`;
    price.innerText = `${price_produit.toFixed(2)} €`;
    imgSrc.src = `${value.imageUrl}`;

    button.setAttribute('productId', value._id);
    button.addEventListener('click', addItem);

    //Fonction qui déclenche l'ajout au panier lors du click
    function addItem(ev){
        //console.log(button.getAttribute(('productId')));
        ev.preventDefault();
        let id = ev.currentTarget.getAttribute('productId'); //On récupère l'ID du produit à ajouter au panier
        //console.log(id);
        let Qty = document.getElementById("qty").value; //On récupère la quantité choisie par le client
        console.log(`Ajout de l'ourson ${id} au panier en ${Qty} exemplaires`);
        
        addToCart(value, Qty); //On fait tourner la fonction d'ajout au panier en passant l'id du produit et la quantité en paramètres
        
        //Puis on déclenche une petite animation en feedback pour informer le client du succès de sa requête
        svgBouton.style.display = 'none';
        textBouton.innerText = `Ajout de l'ourson au panier en ${Qty} exemplaires`
        setTimeout(function(){
            textBouton.innerText = "Ajouter au panier"; 
            svgBouton.style.display = 'initial';
        }, 2000); //Après 2s, le display du bouton revient à la normale
    }
}

//fonction qui permet l'affichage des différentes options de personnalisation du produit (couleur de l'ourson)
function couleur(value) {
    for (let i=0; i<value.colors.length; i++)
     {
        document.getElementById('couleur').innerHTML += `<option value="coul${i}">${value.colors[i]}</option>`;
    }
};


//Requête fetch sur le serveur pour obtenir les informations du produit
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
        }
    )
    .then((jsonResponse) => { //Si la requête est un succès, on délenche les deux fonctions (affichage de la fiche produit et du menu de personnalisation du produit)
        createProduct(jsonResponse);
        couleur(jsonResponse);
    }
)

//GESTION DU PANIER

function ExistingProduct(teddy, cart){ //Vérifie que le produit que l'on souhaite ajouter au panier ne s'y trouve pas déjà
    //console.log(teddy);
    //console.log(cart);
    //console.log(cart.length);
    for(let i=0; i < cart.length; i++){
        let item = cart[i]; //On vérifie l'ID de chaque produit présent dans le panier
        if ((teddy === item.id)) { 
          return i //Si l'id du produit que l'on souhaite ajouter est retrouvé par la fonction, celle-ci renvoie l'élément du panier correspondant
        }
      }
      return null
}

function addToCart(id, qty) { //Ajoute le produit au panier

    let obj = {//Création du produit en tant qu'objet javascript
        id: id._id,
        name: id.name,
        desc: id.description,
        imageUrl: id.imageUrl,
        price: id.price,
        qty: qty
    };

    //On vérifie si le panier existe
    let existingCart = localStorage.getItem('CART');

    if(existingCart === null) {
    //S'il n'existe pas, un crée le panier avec l'objet à ajouter dedans, avec la bonne quantité
        //console.log('Le panier n est pas encore créé' + id.name);
        cartContent.push(obj); //On ajoute l'objet du produit créé à la variable du contenu du panier
        localStorage.setItem('CART', JSON.stringify(cartContent)); //On stringify cette variable pour l'ajouter au panier que l'on créé en tant que contenu ; on appelle ce panier "CART"

    }
    else{
        //console.log('Le panier existe');
        //console.log(localStorage.getItem('CART'));

    //S'il existe, on vérifie d'abord s'il contient l'objet qui nous intéresse
        let cartContent = JSON.parse(localStorage.getItem('CART')); //On exporte et parse le contenu (jusqu'ici stringified) du panier
        //console.log(cartContent);
        //console.log(id._id);
        let teddyInCart = ExistingProduct(id._id, cartContent); //On fait tourner la fonction créée plus tôt à cet effet
        //console.log('Fait ' + teddyInCart);

        if (teddyInCart != null) //Le produit existe déjà dans le panier
            {
                cartContent[teddyInCart].qty = parseInt(cartContent[teddyInCart].qty) + parseInt(qty); //On ajoute la quantité déterminée par le client à celle du produit existant dans le panier
                localStorage.setItem('CART', JSON.stringify(cartContent));
                console.log('le teddy a été ajouté');
            } 
        else //Le produit n'est pas dans le panier
            {
                cartContent.push(obj);
                localStorage.setItem('CART', JSON.stringify(cartContent)); //On ajoute le produit au panier
            }
    }
}

/*Note du développeur : conformément à vos demandes, ce MVP ne tient pas compte de la couleur du produit : même si l'option peut-être sélectionnée sur la fiche produit, il n'y a aucune remontée de celle-ci. 
Lorsque vous souhaiterez avancer le projet et le mettre en prod, une modification rapide nous permettra d'en tenir compte.*/