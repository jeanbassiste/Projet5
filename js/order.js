//On récupère dans le html les deux blocs qui contiendront les messages
let orderSuccess = document.getElementById('orderConfirmed');
let displayPrice = document.getElementById('montantTotal');

//On récupère dans les paramètres d'url les deux variables qui nous intéressent : l'order id et le montant total
let params = window.location.search;
let orderParams = new URLSearchParams(params);
let orderId = orderParams.get('id');
let orderPrice = orderParams.get('price');


//On affiche les messages comprenant les variables au bon endroit
orderSuccess.textContent = `Merci, votre commande n°${orderId} a bien été enregistrée !`;
displayPrice.textContent = `Montant de votre commande : ${orderPrice} €`;