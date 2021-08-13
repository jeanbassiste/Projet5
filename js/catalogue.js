//Affichage du texte d'accueil ; en JavaScript pour que la page soit entièrement réemployable si l'activité du site venait à s'élargir, par exemple en vendant des appareils photos. Il suffit alors de créer une second catalogue concernant le nouveau produit.
class product {
  constructor(category, products, image, description){
      this.category = category;
      this.description = description
  }
}
let catalogue = new product(
  'ours en peluche', 
  "Que l'on soit enfant par l'âge ou par le coeur, nos adorables peluches vous accompagneront et sauront se faire une place de choix dans vos coeurs !");

const titrePrincipal = document.getElementById('titrePrincipal');
titrePrincipal.innerText = `Découvrez nos ${catalogue.category} !`;
const texteAccueil = document.getElementById('texteAccueil');
texteAccueil.innerText = `Orinoco propose un large choix d'${catalogue.category} aux meilleurs prix ! ${catalogue.description}`;

//fonction pour créer les cartes produits du catalogue
function createProductCard(element){
  let card = document.createElement('div'); //On crée la carte
  card.setAttribute('class', 'card');
  
  let cardImage = document.createElement('img'); //On ajoute l'image
  cardImage.setAttribute('class', 'card-img-top');
  cardImage.setAttribute('src', `${element.imageUrl}`);
  cardImage.setAttribute('alt', `L'ourson ${element.name}`);
  card.appendChild(cardImage);

  let cardBody = document.createElement('div'); //Partie texte de la carte
  cardBody.setAttribute('class', 'card-body');

  let productName = document.createElement('h2'); //Nom du produit
  productName.setAttribute('class', 'card-title');
  productName.textContent = `${element.name}`;
  cardBody.appendChild(productName);

  let productPrice = document.createElement('p'); //Prix du produit
  let realPrice = element.price/100;
  productPrice.setAttribute('class', 'card-text');
  productPrice.textContent = `${realPrice.toFixed(2)} €`;
  cardBody.appendChild(productPrice);

  let linkButton = document.createElement('div'); //Bloc lien
  linkButton.setAttribute('class', 'row d-flex justify-content-around');

  let link = document.createElement('a'); //Lien vers la page produit dédiée
  link.setAttribute('class', 'btn btn-primary col-9');
  link.setAttribute('title', "Voir l'ourson");
  link.setAttribute('href', `./products.html?id=${element._id}`);
  link.textContent = "Voir l'ourson";
  linkButton.appendChild(link);

  cardBody.appendChild(linkButton); //On ajoute les éléments 
  card.appendChild(cardBody);
  return(card);
} 

//Fonction fetch pour récupérer les informations des produits et créer la page catalogue
const url2 = "http://localhost:3000/api/teddies"; //url du server qui contient les infos
const productList = document.getElementById("productList"); //Récupère la section du html qui affichera le catalogue

fetch(url2) //on réalise la requête fetch sur le server
  .then(
    (response) => {
      if (response.ok) { //si la requête est bonne et renvoie une réponse valide, on la convertit en json pour pouvoir la réutiliser
        return response.json();
      }
      else { 
        throw new Error("Impossible de générer les oursons");} 
    },
    (networkError) => {//S'il y a un problème et que la requête échoue, on affiche un message d'erreur
      console.log(networkError.message);
      let erreurServeur = document.createElement('p');
      erreurServeur.textContent = 'Erreur serveur, impossible de générer les oursons.'; 
      productList.appendChild(erreurServeur);
    }
  )
  .then((jsonResponse) => { //Si la requête a fonctionné correctement on affiche le catalogue à partir des éléments renvoyés par la requête dans le fichier json
    const nombreProduits = document.getElementById("results");
    jsonResponse.forEach(element =>{ //Boucle : pour chaque élément contenu dans la réponse, on crée un élément html qui correspond à l'ourson concerné
      let product = createProductCard(element);
      productList.appendChild(product);
    });
    nombreProduits.innerText = `${jsonResponse.length}` //On affiche le nombre total de produits sur la page html
     });
