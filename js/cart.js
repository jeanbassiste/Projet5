const CART = {
    KEY: 'cartkey',
    contents: [],
    Init(){
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents) {
            CART.contents = JSON.parse(_contents);
        }else{
            CART.contents = [];
            CART.sync();
        }
    },
    async sync(){
        let _cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, _cart);
    },
    find(id){
        let match = CART.contents.filter(item => {
            if(item.id == id._id)
            return true;
            console.log('On a trouvé!' + item.id + ' et ' + id._id)
        });
        console.log('le résultat excompté : ' + match)
        if(match && match[0])
        return match[0];
        console.log('ça a marché : ' +  match[0])
    },
    add(id, qty){
        if(CART.find(id)){
            CART.increase(id, 1);
        }else{
                let obj = {
                    id: id._id,
                    name: id.name,
                    desc: id.description,
                    imageUrl: id.imageUrl,
                    price: id.price,
                    qty: qty
                };
                CART.contents.push(obj);
                CART.sync();


        }
    },
    increase(id){
        CART.contents = CART.contents.map(item=>{
            if(item.id === id._id)
            item.qty = item.qty ++;
            return item;
        });
        CART.sync()
    },
    reduce(id){
        CART.contents = CART.contents.map(item=>{
            if(item.id === id)
            item.qty = item.qty --;
            return item;
        });
        CART.contents.forEach(async item=>{
            if(item.id === id && item.qty === 0)
            await CART.remove(id); 
        });
        CART.sync()
    },
    remove(id){
        CART.contents = CART.contents.filter(item=>{
            if(item.id !== id)
            return true;
        });
        CART.sync();
    },
    empty(){
        CART.contents = [];
        CART.sync();
    }
};

document.addEventListener('DOMContentLoaded', ()=>{
    CART.Init();
    displayCart();
})

let emptyButton = document.getElementById('emptyCart');
emptyButton.addEventListener('click', emptyCart);
let removeItem = document.getElementById('removeItem');
removeItem.addEventListener('click', removeProduct);

function emptyCart(ev){
    ev.preventDefault();
    localStorage.clear();
}

function removeProduct(ev){
    ev.preventDefault();
    
}


function displayCart(){
    let cartDisplay = document.getElementById('cartDisplay');
    let message = document.createElement('h2');
    console.log(CART.contents);
    cartDisplay.appendChild(message);  


    if(CART.contents !== []){
        document.getElementById('cartTable').style.display = 'table';
        document.getElementById('commande').style.display = 'initial';
        document.getElementById('panierVide').style.display = 'none';
        let orderPrice = 0;
        let orderPriceDisplay = document.getElementById('totalPrice');
        CART.contents.forEach(item=>{
            let unityPrice = item.price/100;
            let totalPrice = item.price*item.qty/100;
            let line = document.createElement('tr');
            let imgContainer = document.createElement('td');
            imgContainer.setAttribute('id', 'productThmb');
            let img = document.createElement('img');
            img.setAttribute('src', item.imageUrl);
            imgContainer.appendChild(img);
            line.appendChild(imgContainer);
            let name = document.createElement('td');
            name.textContent = item.name;
            line.appendChild(name);
            let productPrice = document.createElement('td');
            productPrice.textContent = `${unityPrice.toFixed(2)} €`;
            line.appendChild(productPrice);
            let qté = document.createElement('td');
            qté.textContent = item.qty;
            line.appendChild(qté);
            let subTotal = document.createElement('td');
            subTotal.textContent = `${totalPrice.toFixed(2)} €`;
            line.appendChild(subTotal);
            let abandon = document.createElement('td');
            abandon.setAttribute('id', 'removeItem');
            abandon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>`
            line.appendChild(abandon);
            cartDisplay.appendChild(line);
            orderPrice = orderPrice + totalPrice;
            console.log(orderPrice);

        })
        orderPriceDisplay.textContent = `${orderPrice.toFixed(2)} €`;
    }else if(localStorage = false){
        document.getElementById('cartTable').style.display = 'none';
        document.getElementById('commande').style.display = 'none';
        document.getElementById('panierVide').style.display = 'initial';
    } 
}

let order = document.getElementById('envoi');
order.addEventListener('click', passOrder);

function passOrder(ev){
    ev.preventDefault();
    let order = JSON.stringify(CART.contents);
    console.log('votre commande: ' + order);
    let contact = [
        firstName = document.getElementById('fname').value,
        lastName = document.getElementById('lname').value,
        address = document.getElementById('address').value,
        city = document.getElementById('city').value,
        email = document.getElementById('email').value
    ]
    console.log(contact);

}
