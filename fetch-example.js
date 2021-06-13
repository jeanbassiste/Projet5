const url = "http://localhost:3000/api/teddies";
const status = document.getElementById("status");
const statusBis = document.getElementById("statusBis");

fetch(url)
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
    const nombreProduits = document.getElementById("results");
    let teddyBears = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      teddyBears[i] = new teddies(
        jsonResponse[i].colors,
        jsonResponse[i]._id,
        jsonResponse[i].name,
        jsonResponse[i].price,
        jsonResponse[i].imageUrl,
        jsonResponse[i].description
      );
    }
    nombreProduits.innerText = teddyBears.length;
    status.innerText = jsonResponse[4]._id;
    statusBis.innerText = `${teddyBears[1].imageUrl}, ${teddyBears[1].description}, ${teddyBears[1].colors} nous avons aussi ${teddyBears[4]._id} qui s'appelle ${teddyBears[4].name} et qui coûte ${teddyBears[4].price}`;
  });
