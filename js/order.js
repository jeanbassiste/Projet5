let orderSuccess = document.getElementById('orderConfirmed');
let params = window.location.search;
let orderParams = new URLSearchParams(params);
let orderId = orderParams.get('id');

orderSuccess.textContent = `Merci, votre commande n°${orderId} a bien été enregistrée !`;