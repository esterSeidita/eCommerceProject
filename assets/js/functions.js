export {
    q,
    getApi,
    cardGenerator,
    qAll,
    checkoutGenerator,
    loginGenerator
}

const q = (selector) => document.querySelector(selector);
const qAll = (selector) => document.querySelectorAll(selector);
let localCartProducts =  JSON.parse(localStorage.getItem('cartProducts'));
const localProducts =  JSON.parse(localStorage.getItem('products'));
const overlay = q(".overlay");
const modal = q(".modal");

if(localCartProducts !== null){
    q(".numProductsInCart").textContent = localCartProducts.length;
}

if (localCartProducts !== null && localCartProducts.length === 0){
    q(".numProductsInCart").textContent = "";
}

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
    <p class="price">${priceIVA(data.price).toFixed(2)} €</p>
    <h3>${reduceString(data.title, 20)}...</h3>
    </div>
    `)
    .join("")

    /* -------------------------------------------------------------------------- */
    /*                                 Modal Open                                 */
    /* -------------------------------------------------------------------------- */

    const productCards = qAll(".productCard");
    productCards.forEach(card=>{
        card.addEventListener("click", () => {
            const currentCard = array[card.id-1];
            overlay.classList.add("open");
            modal.classList.add("open");
            modal.innerHTML=`
                <img class="closeModalBtn" src="./assets/img/closeBtn.png">
                <img class="modalImage" src="${currentCard.image}">
                <div class="mainModal">
                    <h3>${currentCard.title}</h3>
                    <p>${currentCard.description}</p>
                    <p class="modalPrice">${priceIVA(currentCard.price).toFixed(2)} €</p>
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
                        localStorage.setItem("cartProducts", JSON.stringify([localProducts[btn.id]]));
                        localCartProducts = JSON.parse(localStorage.getItem("cartProducts"));
                    }else{
                        localCartProducts.push(localProducts[btn.id]);
                        localStorage.setItem("cartProducts", JSON.stringify(localCartProducts));
                    }

                    q(".numProductsInCart").textContent = localCartProducts.length;

                    closeModal();

                }) //end onclick event
            }) //end forEach cart button



            q(".closeModalBtn").addEventListener("click", closeModal);
    })// end event on click

    overlay.addEventListener("click", () =>{
        closeModal();
    });
}) //end foreach card...
} //end of function



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

    let totalPrice = 0;


    q(".pageWrapper").innerHTML = "";
    q(".loginPage").innerHTML = "";

    if(localCartProducts!== null && localCartProducts.length !== 0){
        const rows = localCartProducts.map((product, index) => {
            totalPrice += parseFloat(priceIVA(product.price).toFixed(2));
            return `<tr>
                <td><img src="${product.image}"></td>
                <td>${product.title}</td>
                <td>${priceIVA(product.price).toFixed(2)} €</td>
                <td><button id="${index}" class="delBtn"><span>x</span></button></td>
            </tr>`
        }
        ).join("");

        q(".checkout").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2">Total (IVA inc.)</th>
                    <td colspan="2">${totalPrice.toFixed(2)} €</td>
                </tr>
            </tfoot>
        </table>
        <button class="confirmPurchase">Confirm Purchase</button>
    `;

    } else{
        q(".checkout").innerHTML = `
        <div class="responsePage">
        <p>I'm sorry, but your cart is empty!</p>
        <button onClick="window.location.reload(true)">Go Shopping!</button>
        </div>
`
    }
    
    const delBtns = qAll(".delBtn");
    delBtns.forEach(btn => btn.addEventListener("click", () => {
        localCartProducts.splice([btn.id], 1);
        localStorage.setItem("cartProducts", JSON.stringify(localCartProducts));
        checkoutGenerator();
    }));

    q(".confirmPurchase").addEventListener("click", () => {
        const localUserData = JSON.parse(localStorage.getItem("loginData"));
        if(localUserData === null){
            alert("Please login first :)");
            loginGenerator();
        }else{

        q(".checkout").innerHTML = `
        <form>
        <h1>Shipping Datas</h1>
        <div class="row">
          <input type="text" id="name" placeholder="Your Name" />
          <input type="text" id="number" placeholder="Your Number" />
        </div>
  
        <div class="row">
            <input type="text" id="country" placeholder="Country" />
            <input type="text" id="address" placeholder="Address" />
        </div>
        <div class="creditCard">
          <h3>Credit Card Detail</h3>
          <div class="row">
            <input type="text" id="cardNumber" placeholder="Card Number" />
          </div>
          <div class="row">
            <select name="month" id="month">
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
            <select name="year" id="year">
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
  
          <div class="row">
              <input type="text" placeholder="CVV" />
            <div class="cvv-details">
              <p>
                3 or 4 digits usually found
                on the signature strip
              </p>
            </div>
          </div>
        </div>
        <button id="submitForm">Confirm</button>
      </form>
    `;

    q("#submitForm").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("cartProducts");
        q(".numProductsInCart").textContent = "";
        q(".checkout").innerHTML = 
            `<div class="responsePage">
            <p>Thank you for the purchase!</p>
            <button onClick="window.location.reload(true)">Homepage</button>
            </div>`;
        return false;
    })
}

});

}

/* -------------------------------------------------------------------------- */
/*                                  Price IVA                                 */
/* -------------------------------------------------------------------------- */

const priceIVA = (price, IVA = 22) => {
    return parseFloat(price) + (parseFloat(price)*parseFloat(IVA)/100);
}

/* -------------------------------------------------------------------------- */
/*                            Login Page Generator                            */
/* -------------------------------------------------------------------------- */

const loginGenerator = () =>{
    const localUserData = JSON.parse(localStorage.getItem("loginData"));
    const loginDiv = q(".loginPage");
    loginDiv.classList.add("d-flex");
    overlay.classList.add("open");

    if(localUserData === null){
        loginDiv.innerHTML = `
        <h2>Log-In</h2>
        <div class="row">
            <input type="text" placeholder="Username" id="username">
            <input type="password" placeholder="Password" id="password">
        </div>
        <div class="row">
        <button id="loginSubmit">Submit</button>
        <button id="cancel">Cancel</button>
        </div>
    `

    q("#cancel").addEventListener("click", () => {
        loginDiv.classList.remove("d-flex");
        overlay.classList.remove("open");
    });

    q("#loginSubmit").addEventListener("click", () =>{
        const username = q("#username").value;
        const password = q("#password").value;
        localStorage.setItem("loginData", JSON.stringify([username, password]));
        loginDiv.classList.remove("d-flex");
        overlay.classList.remove("open");
    })
    }
    else{
        loginDiv.innerHTML = `
        <h2>Hi ${localUserData[0]}!</h2>
        <p>You are correctly logged in!</p>
        <div class="row">
        <button class="goBtn" onClick="window.location.reload(true)">Go Shopping!</button>
        <button class="changeBtn" id="changeAccount">Change Account</button>
        </div>
    `
        q(".changeBtn").addEventListener("click", () => {
            localStorage.removeItem("loginData");
            loginGenerator();
        })
    }



    overlay.addEventListener("click", () =>{
        loginDiv.classList.remove("d-flex");
        overlay.classList.remove("open");
    });


}

