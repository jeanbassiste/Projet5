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



//Fonction fetch pour récupérer les informations des produits et créer la page catalogue
const url2 = "http://localhost:3000/api/teddies"; //url du server qui contient les infos
const productList = document.getElementById("productList"); //Récupère la section du html qui affichera le catalogue

fetch(url2) //on réalise la requête fetch sur le server
  .then(
    (response) => {
      if (response.ok) { //si la requête est bonne et renvoie une réponse valide, on la convertit en json pour pouvoir la réutiliser
        return response.json();
      }
      else { //S'il y a un problème et que la requête échoue, on affiche un message d'erreur
        throw new Error("Impossible de générer les oursons");} 
        console.log(Error);
    },
    (networkError) => {
      console.log(networkError.message);
    }
  )
  .then((jsonResponse) => { //Si la requête a fonctionné correctement on affiche le catalogue à partir des éléments renvoyés par la requête dans le fichier json
    const nombreProduits = document.getElementById("results");
    jsonResponse.forEach(element =>{ //Boucle : pour chaque élément contenu dans la réponse, on crée un élément html qui correspond à l'ourson concerné
      let realPrice = element.price/100;
      productList.innerHTML += 
      `<div class="card">
      <img class="card-img-top" src="${element.imageUrl}" alt="L'ourson ${element.name}">
      <div class="card-body">
          <h2 class="card-title">${element.name}</h2>
          <p class="card-text">${realPrice.toFixed(2)} €</p>
          <div class="row d-flex justify-content-around">
              <a href="./products.html?id=${element._id}" class="btn btn-primary col-9">Voir l'ourson</a>                          
          </div>                       
      </div>
      </div>
      </div>`
    });
    nombreProduits.innerText = `${jsonResponse.length}` //On affiche le nombre total de produits sur la page html
     });
