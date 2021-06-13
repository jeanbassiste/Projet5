class product {
    constructor(category, products, image, description){
        this.category = category;
        this.products = products;
        this.image = image;
        this.description = description
    }
}

class teddies {
    constructor(colors, _id, name, price, imageUrl, description){
        this.colors = colors;
        this._id = _id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }
} 

let catalogue = new product('ours en peluche', ['ours1', 'ours2', 'ours3', 'ours4'], ['ours1.imageUrl', 'ours2.imageUrl', 'ours3.imageUrl'], "Que l'on soit enfant par l'âge ou par le coeur, nos adorables peluches vous accompagneront et sauront se faire une place de choix dans vos coeurs !");



