import{
    q,
    getApi,
    cardGenerator,
    qAll
} from "./functions.js";

const navbar = q(".navbar");
const navSection = q("nav");
const categoryList = q(".categoryList");
const productsWrapper = q(".productsWrapper");
const searchBtn = q(".searchBtn");
const searchInput = q("#search");

navSection.addEventListener("click", () => {
    navbar.classList.add('open');
    navSection.classList.add('closed');
});

q(".closeBtn").addEventListener("click", () =>{
    navbar.classList.remove('open');
    navSection.classList.remove('closed');
})

const localProducts = JSON.parse(localStorage.getItem('products'));
const localCategories = JSON.parse(localStorage.getItem('categories'));

if(localProducts === null | localCategories === null){
    getApi("https://fakestoreapi.com/products")
    .then(datas => {
        localStorage.setItem("products", JSON.stringify(datas));
        cardGenerator(datas, productsWrapper);
        
        getApi("https://fakestoreapi.com/products/categories")
            .then((datas) => {
                localStorage.setItem("categories", JSON.stringify(datas));
                categoryList.innerHTML = 
                datas.map(data => `<li class="category">${data.charAt(0).toUpperCase() + data.slice(1)}</li>`)
                .join("");
            })// end second then...
    }); // end first then
} // end if...

    cardGenerator(localProducts, productsWrapper, "", "");

    categoryList.innerHTML = 
    localCategories.map(data => `<li class="category">${data.charAt(0).toUpperCase() + data.slice(1)}</li>`)
    .join("");

    const category = qAll(".category");
    category.forEach(li => {
        li.addEventListener("click", () => {
            const filter = li.textContent.toLowerCase();
            cardGenerator(localProducts, productsWrapper, filter);
        })
    })

    searchBtn.addEventListener("click", () => {
        cardGenerator(localProducts, productsWrapper, "", searchInput.value)
    })


