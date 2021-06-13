const url2 = "http://localhost:3000/api/teddies";
const productList = document.getElementById("productList");
PRODUCTS = [];

fetch(url2)
  .then(
    (response) => {
      if (response.ok) {
        return response.json();
      }
      else {
        throw new Error("Impossible de générer les oursons");}
    },
    (networkError) => {
      console.log(networkError.message);
      status.innerText = "Error";
    }
  )
  .then((jsonResponse) => {
    PRODUCTS = jsonResponse;
    const nombreProduits = document.getElementById("results");
    let teddyBears = [];
    jsonResponse.forEach(element =>{
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
      console.log(PRODUCTS)
    });
    nombreProduits.innerText = `${jsonResponse.length}`
     });
