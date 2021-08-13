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
let textBouton = document.getElementById('panier');
let svgBouton = document.querySelector("#panier > svg");

//Fonction qui affiche le produit sur le site en remplissant la fiche produit HTML avec les infos récupérées dans la requête fetch
function createProduct(value) {

    let container = document.createElement('div');
    container.setAttribute('class', 'row');

    let imgSrc = document.createElement('img');
    imgSrc.setAttribute('id', 'image_produit');
    imgSrc.setAttribute('class', 'col-12 col-md-6');
    imgSrc.setAttribute('alt', 'Photo du produit');
    imgSrc.src = `${value.imageUrl}`;
    container.appendChild(imgSrc);

    let textProduit = document.createElement('div');
    textProduit.setAttribute('id', 'text_produit');
    textProduit.setAttribute('class', 'col-12 col-md-6');

    let nameProduit = document.createElement('h1');
    nameProduit.setAttribute('id', 'name_produit');
    nameProduit.textContent = `${value.name}`;
    textProduit.appendChild(nameProduit);

    let desc = document.createElement('p');
    desc.setAttribute('id', 'description_produit');
    desc.textContent = `${value.description}`;
    textProduit.appendChild(desc);

    let price = document.createElement('h2');
    let price_produit = value.price/100; //Mise en forme du prix du produit
    price.setAttribute('id', 'price_produit');
    price.textContent = `${price_produit.toFixed(2)} €`;
    textProduit.appendChild(price);

    let colorForm = document.createElement('form');
    colorForm.setAttribute('id', 'choix_couleur');
    colorForm.setAttribute('class', 'my-3');
    let colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'couleur');
    colorLabel.setAttribute('class', 'fw-bold');
    colorLabel.textContent = 'Couleur :';
    colorForm.appendChild(colorLabel);
    let colorSelect = document.createElement('select');
    colorSelect.setAttribute('name', 'couleur');
    colorSelect.setAttribute('id', 'couleur');
    for (let i=0; i<value.colors.length; i++)
    {
        let colorChoice = document.createElement('option');
        colorChoice.setAttribute('value', `coul${i}`);
        colorChoice.textContent = `${value.colors[i]}`;
        colorSelect.appendChild(colorChoice);
    }
    colorForm.appendChild(colorSelect);
    textProduit.appendChild(colorForm);

    let qtyForm = document.createElement('form');
    qtyForm.setAttribute('class', 'my-3');
    let qtyLabel = document.createElement('label');
    qtyLabel.setAttribute('for', 'qty');
    qtyLabel.setAttribute('class', 'fw-bold');
    qtyLabel.textContent = 'Quantité :';
    qtyForm.appendChild(qtyLabel);
    let qtyInput = document.createElement('input');
    qtyInput.setAttribute('id', 'qty');
    qtyInput.setAttribute('type', 'number');
    qtyInput.setAttribute('name', 'quantité');
    qtyInput.setAttribute('min', '1');
    qtyInput.setAttribute('value', '1');
    qtyInput.setAttribute('required', '');
    qtyInput.setAttribute('onKeyDown', 'return false');
    qtyForm.appendChild(qtyInput);
    textProduit.appendChild(qtyForm);

    let button = document.createElement('button');
    button.setAttribute('id', 'panier');
    button.setAttribute('class', 'btn btn-success rounded-pill my-3');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', '');
    button.setAttribute('data-bs-target', '');
    button.setAttribute('productId', value._id);
    button.addEventListener('click', addItem);
    button.textContent = 'Ajouter au panier';
    textProduit.appendChild(button);

    container.appendChild(textProduit);

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
        button.textContent = `Ajout de l'ourson au panier en ${Qty} exemplaires`
        setTimeout(function(){
            button.textContent = "Ajouter au panier"; 
        }, 2000); //Après 2s, le display du bouton revient à la normale
    }

    return(container);
}




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
            let errorMessage = document.getElementById('errorMessage');
            errorMessage.style.display = 'initial';
        }
    )
    .then((jsonResponse) => { //Si la requête est un succès, on délenche les deux fonctions (affichage de la fiche produit et du menu de personnalisation du produit)
        let ficheProduit = createProduct(jsonResponse);
        let displayProduit = document.getElementById('ficheProduit');

        displayProduit.appendChild(ficheProduit);
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