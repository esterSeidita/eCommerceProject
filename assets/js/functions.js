export {
    q,
    getApi,
    cardGenerator,
    qAll
}

const q = (selector) => document.querySelector(selector);
const qAll = (selector) => document.querySelectorAll(selector);

let localCartProducts =  JSON.parse(localStorage.getItem('cartProducts'));
const localProducts =  JSON.parse(localStorage.getItem('products'));

if(localCartProducts !== null){
    q(".numProductsInCart").textContent = localCartProducts.length;
}

const overlay = q(".overlay");
const modal = q(".modal");

const getApi = async(URL) => {
    const data = await fetch(URL);
    return await data.json();
}

const reduceString = (text, maxChar) => {
    return text.split("").slice(0,maxChar).join("");
}

/* -------------------------------------------------------------------------- */
/*                           Card Generator Function                          */
/* -------------------------------------------------------------------------- */

const cardGenerator = (array, element, filterCategory = "", filterTitle = "") =>{

    const filteredArray = array.filter((product) => product.category.includes(filterCategory) && product.title.toLowerCase().includes(filterTitle.toLowerCase()));
    element.innerHTML = 
    filteredArray.map(data => 
    `
    <div id="${data.id}" class="productCard">
    <img src="${data.image}" alt="Product Image"/>
    <p class="price">${data.price} €</p>
    <h3>${reduceString(data.title, 20)}...</h3>
    </div>
    `)
    .join("")

    const productCards = qAll(".productCard");
    productCards.forEach(card=>{
        card.addEventListener("click", () => {
            const currentCard = array[card.id-1];
            overlay.classList.add("open");
            modal.classList.add("open");
            modal.innerHTML=`
                <img src="${currentCard.image}">
                <div class="mainModal">
                    <h3>${currentCard.title}</h3>
                    <p>${currentCard.description}</p>
                    <p class="modalPrice">${currentCard.price} €</p>
                    </div>
                <button id="${card.id-1}" class="cartBtn"><i class="fa fa-shopping-cart cartIcon" aria-hidden="true"></i></button>
            `

            /* -------------------------------------------------------------------------- */
            /*                                 Add to Cart                                */
            /* -------------------------------------------------------------------------- */

            const cartBtns = qAll(".cartBtn");
            
            cartBtns.forEach(btn => {
                btn.addEventListener("click", () =>{        
                    if(localCartProducts === null){
                        localCartProducts = [localProducts[btn.id]];
                        localStorage.setItem("cartProducts", JSON.stringify(localCartProducts));
                    }else{
                        console.log('localCartProducts', localCartProducts)
                        localCartProducts.push(localProducts[btn.id]);
                        localStorage.setItem("cartProducts", JSON.stringify(localCartProducts));
                    }

                    q(".numProductsInCart").textContent = localCartProducts.length;

                    closeModal();

                }) //end onclick event
            }) //end forEach cart button

    })// end event on click
}) //end foreach card...
} //end of function

overlay.addEventListener("click", () =>{
    closeModal();
});

/* -------------------------------------------------------------------------- */
/*                                 Close Modal                                */
/* -------------------------------------------------------------------------- */

const closeModal = () =>{
        overlay.classList.remove("open");
        modal.classList.remove("open");
}



/* -------------------------------------------------------------------------- */
/*                                Cart Checkout                               */
/* -------------------------------------------------------------------------- */

const checkoutGenerator = () => {
    // const checkoutDiv = document.createElement('div');
    let totalPrice = 0;
    const rows = localCartProducts.map(product => {
        totalPrice += parseFloat(product.price);
        return `<tr>
            <td><img src="${product.image}"></td>
            <td>${product.title}</td>
            <td>${product.price} €</td>
        </tr>`
    }
    ).join("");

    q(".pageWrapper").innerHTML = ""
    q(".checkout").innerHTML = `
        <h1>Your Cart</h1>
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2">Total</th>
                    <td>${totalPrice.toFixed(2)} €</td>
                </tr>
            </tfoot>
        </table>
        <button class="confirmPurchase">Confirm Purchase</button>
    `;

    q(".confirmPurchase").addEventListener("click", () => {
        q(".checkout").innerHTML = `
        <h1>Thank You!! :)</h1>
    `;
    localStorage.removeItem("cartProducts");
    q(".numProductsInCart").textContent = "";

    });
}



q(".cartBlock").addEventListener("click", checkoutGenerator)
