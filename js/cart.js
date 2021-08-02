//Gestion du panier

//On récupère le contenu du panier dans une variable pour s'en resservir + on initialise le montant total de la commande qui sera utilisé dans les paramètres d'URL de la prochaine page
let CARTcontent = JSON.parse(localStorage.getItem('CART'));
let montantCommande = 0;
//console.log(CARTcontent);

//On prépare l'affichage du panier dans le HTML
let cartDisplay = document.getElementById('cartDisplay');
let message = document.createElement('h2');
cartDisplay.appendChild(message); 


//Affichage du panier dans le HTML
if(CARTcontent !== null && CARTcontent.length !== 0){ //On vérifie que le panier existe et qu'il y a du contenu dedans. Ici c'est le cas, donc le panier va s'afficher
    document.getElementById('cartTable').style.display = 'table'; //On affiche le tableau de contenu
    document.getElementById('commande').style.display = 'initial'; //On affiche le formulaire de commande
    document.getElementById('panierVide').style.display = 'none'; //On désaffiche le message "Panier vide" qui s'affiche par défaut

    let orderPrice = 0;
    let orderPriceDisplay = document.getElementById('totalPrice');
    CARTcontent.forEach(item=>{ //On crée une ligne pour chaque produit dans le panier
        let itemId = item.id; //On récupère l'ID du produit, on s'en resservira dans le bouton pour retirer le produit du panier

        let unityPrice = item.price/100; //Mise en forme du prix à l'unité
        let totalPrice = item.price*item.qty/100; //Calcul et mise en forme du sous-total pour le produit

        let line = document.createElement('tr'); //Création de la ligne dans le tableau du panier

        let imgContainer = document.createElement('td'); //Affichage de l'image
        imgContainer.setAttribute('id', 'productThmb');
        let img = document.createElement('img');
        img.setAttribute('src', item.imageUrl);
        imgContainer.appendChild(img);
        line.appendChild(imgContainer);

        let name = document.createElement('td'); //Affichage du nom
        name.textContent = item.name;
        line.appendChild(name);

        let productPrice = document.createElement('td'); //Affichage du prix unitaire
        productPrice.textContent = `${unityPrice.toFixed(2)} €`;
        line.appendChild(productPrice);

        let qté = document.createElement('td'); //Affichage de la quantité
        qté.textContent = item.qty;
        line.appendChild(qté);

        let subTotal = document.createElement('td'); //Affichage du sous-total pour le produit
        subTotal.textContent = `${totalPrice.toFixed(2)} €`;
        line.appendChild(subTotal);

        let abandon = document.createElement('td'); //Bouton pour retirer le produit du panier
        abandon.setAttribute('id', 'removeItem');
        abandon.addEventListener('click',() => removeProduct(itemId));
        abandon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>`
        line.appendChild(abandon);
        
        cartDisplay.appendChild(line); //Ajout de la ligne créée au tableau

        orderPrice = orderPrice + totalPrice; //Mise à jour du prix total à l'ajout de chaque ligne
        montantCommande = orderPrice;
        //console.log(orderPrice);

    })
    orderPriceDisplay.textContent = `${orderPrice.toFixed(2)} €`; //Affichage du prix total de la commande
}

//Création du bouton pour vider le panier
let emptyButton = document.getElementById('emptyCart');
emptyButton.addEventListener('click', emptyCart);

function emptyCart(ev){
    ev.preventDefault();
    localStorage.clear();
    document.location.reload();
}

//Fonction pour retirer 1 produit du panier
function removeProduct(id){
    
    for (let teddy of CARTcontent){
        if (id === teddy.id){//On compare l'ID qu'on passe en paramètre de la fonction à l'ID de chaque élément contenu dans le panier. S'ils sont égaux, on déclenche récupère l'index de l'élément correspondant et on le retire du panier
            const index = CARTcontent.indexOf(teddy);
            CARTcontent.splice(index, 1);
        }
    }
    localStorage.setItem('CART', JSON.stringify(CARTcontent));
    document.location.reload();
}


//FORMULAIRE DE COMMANDE

//Validation des données entrées par l'utilisateur

//On récupère le champ qui contient chacune des données à valider
let fnameData = document.getElementById('fname');
let lnameData = document.getElementById('lname');
let addressData = document.getElementById('address');
let postCodeData = document.getElementById('postCode');
let emailData = document.getElementById('email');
let cityData = document.getElementById('city');

//On passe le champ récupéré à la fonction de validation
fnameData.addEventListener('change', () => isValid(fnameData));
lnameData.addEventListener('change', () => isValid(lnameData));
addressData.addEventListener('change', () => isValid(addressData));
postCodeData.addEventListener('change', () => isValid(postCodeData));
emailData.addEventListener('change', () => isValid(emailData));
cityData.addEventListener('change', () => isValid(cityData));


//Fonction de validation
function isValid(donnee){
    let dataType = donnee.id;
    let data = donnee.value;
    let valid;
    let result;
    let emptyData = new RegExp(/\s+/);

    if (data === null || emptyData.test(data) === true){ //D'abord, on vérifie que le champ n'est pas vide ou seulement composé d'espaces
        result = false;
        document.getElementById(`${dataType}`).setAttribute('class', 'form-control is-invalid'); //On affiche la mise en page "champ incorrect"
        document.getElementById('errorMessage').style.display = 'initial';//On affiche le message d'erreur
        return false;
    }
    //On vérifie le type de données du champ que l'on passe à la validation
    if(dataType === 'postCode'){//pattern de validation pour le champ code postal : seulement des chiffres, 5 max
        valid = new RegExp(/[0-9]{5}/);
    }
    else if(dataType === 'address'){//pattern de validation pour le champ adresse : chiffre, lettres, espaces, virgules, tirets
        valid = new RegExp(/[a-zA-Z0-9_]/);
    }
    else if(dataType === 'fname' || dataType === 'lname'){//pattern de validation pour les noms et prénoms : lettres et espaces
        valid = new RegExp(/[A-Za-z]/);
    }
    else if(dataType === 'email'){//pattern de validation pour l'email : tout sauf @ puis @ puis tout sauf @ puis . puis 2 ou 3 lettres
        valid = new RegExp(/[^@]+@[^@]+\.[a-zA-Z]{2,3}/);
    }
    else if (dataType === 'city'){//pattern de validation pour la ville : lettre et espace
        valid = new RegExp(/[A-Za-z_]/);
    }

    if(valid.test(data) === true){//On test le contenu du champ face à son pattern de validation ; si le test passe, on affiche la mise en page succès et la fonction renvoie vrai, sinon mise en page échec et fonction renvoie faux
        result = true;
        document.getElementById(`${dataType}`).setAttribute('Class', ('form-control is-valid'));
        return true;
    }
    else{
        result = false;
        document.getElementById(`${dataType}`).setAttribute('class', 'form-control is-invalid');
        return false;
    }
    console.log(result);
    
}


//Bouton d'envoi de la commande

//On récupère le bouton dans le html et on lui accolle la fonction de commande
let order = document.getElementById('envoi');
order.addEventListener('click', passOrder);


//Fonction de commande
function passOrder(ev){
    
    ev.preventDefault();

    //On vérifie que tous les champs sont valides. Si oui, on déclenche la fonction fetch pour envoyer les données et récupérées l'order id puis on vide le panier et on ouvre une nouvelle page "confirmation"; avec l'order id récupéré en fetch et le montant total de la commande en paramètre d'url
    if(isValid(fnameData) && isValid(lnameData) && isValid(addressData) && isValid(postCodeData) && isValid(emailData)/* && isValid(cityData)*/){
        //console.log('Its all good man');
        let infoClient = {
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value
        }
        
        let listOfProducts =[];

        for(teddy of CARTcontent){
            listOfProducts.push(teddy.id);
        }
        console.log(listOfProducts);
    
        let dataToSend = {
            contact : infoClient,
            products : listOfProducts,                
        };
        console.log(dataToSend);
    
        let fetchUrl = "http://localhost:3000/api/teddies/order";
        fetch(fetchUrl,{
            method : 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(dataToSend), 

          })
        .then(response => {
            if (response.ok) {
                console.log('ça marche')
                return response.json();
            }
            else {
                console.error('Code Erreur', response.status);
            }
        })
        .then(jsonResponse =>{
            let confirmationId = jsonResponse.orderId;
            window.location.href = `confirmorder.html?id=${confirmationId}&price=${montantCommande}`;
            localStorage.clear();
            console.log('ça marche');  
        })
    }
    else{ //Si non, on affiche le message d'erreur et on ne fait rien d'autre
        document.getElementById('errorMessage').style.display = 'initial';
    }
}
