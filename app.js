const treeShowcaseWrapper = document.getElementById('tree-showcase-wrapper');
const categoriesWrapper = document.getElementById('categories-wrapper');
const cartItemWrapper = document.getElementById('cart-item-wrapper');
const cartTotalWrapper = document.getElementById('cart-total-wrapper');

const getData = async url => {
    const res = await fetch(url);
    return res.json();
}

// Load Categories
const getCategory = () => {
    getData('https://openapi.programming-hero.com/api/categories')
    .then(data => showCategory(data.categories));
}

const showCategory = categories => {
    categoriesWrapper.innerHTML = '';
    categories.forEach(category => {
        const {id, category_name} = category;
        const li = document.createElement('li');
        li.className = "category-li text-base cursor-pointer p-2";
        li.innerText = category_name;
        li.onclick = () => getAllTrees(`https://openapi.programming-hero.com/api/category/${id}`);
        categoriesWrapper.appendChild(li);
    });
}

// Load All Trees
const getAllTrees = url => {
    getData(url).then(data => showAllTrees(data.plants));
}

const showAllTrees = plants => {
    treeShowcaseWrapper.innerHTML = '';
    plants.forEach(plant => {
        const {id, image, name, description, category, price} = plant;
        const shortDescription = description.split(' ').slice(0, 14).join(' ');
        treeShowcaseWrapper.innerHTML += `
            <div class="tree-showcase-item bg-white p-4 rounded-lg">
                <img class="w-full h-[185px] rounded-lg object-cover" src="${image}" alt="${name}">
                <h5 onclick="showTreeDetails(${id})" class="tree-title text-sm font-semibold text-[#1f2937] mt-3 mb-2 cursor-pointer">${name}</h5>
                <p class="text-xs text-[#1f2937] opacity-80">${shortDescription}</p>
                <div class="flex justify-between mt-2 mb-3">
                    <p class="text-sm bg-[#dcfce7] py-1 px-2 rounded-full text-[#15803D] font-medium">${category}</p>
                    <p class="text-sm font-semibold">৳<span class="tree-price">${price}</span></p>
                </div>
                <button onclick="calculateCartTotals(this)" class="p-3 w-full bg-[#15803d] text-white text-base rounded-full font-medium">Add to Cart</button>
            </div>`;
    });
}

// Tree Details Modal
const showTreeDetails = id => {
    const modal = document.getElementById('tree_details_modal');
    const modalContainer = document.getElementById('modal-container');
    modal.showModal();
    getData(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(data => {
        const {image, name, description, category, price} = data.plant;
        modalContainer.innerHTML = `
            <img class="w-full h-[300px] rounded-lg object-cover" src="${image}" alt="${name}">
            <h5 class="text-sm font-semibold mt-3 mb-2">${name}</h5>
            <p class="text-xs opacity-80">${description}</p>
            <div class="flex justify-between mt-2 mb-3">
                <p class="text-sm bg-[#dcfce7] py-1 px-2 rounded-full text-[#15803D] font-medium">${category}</p>
                <p class="text-sm font-semibold">৳${price}</p>
            </div>`;
    });
}

// Cart System
let totalPrice = 0;
const calculateCartTotals = target => {
    const title = target.parentNode.querySelector('.tree-title').innerText;
    const price = parseInt(target.parentNode.querySelector('.tree-price').innerText);
    cartItemWrapper.innerHTML += `
        <div class="cart-item flex justify-between items-center bg-[#f0fdf4] py-2 px-3 mt-2">
            <div>
                <h5 class="text-sm font-semibold">${title}</h5>
                <p class="opacity-50 text-base">৳<span class="cart-item-details-price">${price}</span> x 1</p>
            </div>
            <div class="cursor-pointer" onclick="removeCartItem(this, ${price})">
                <img src="./assets/close.png" alt="Close">
            </div>
        </div>`;
    totalPrice += price;
    updateCartTotal();
}

const removeCartItem = (item, price) => {
    item.parentNode.remove();
    totalPrice -= price;
    updateCartTotal();
}

const updateCartTotal = () => {
    const cartItems = document.getElementsByClassName('cart-item');
    if(cartItems.length > 0){
        cartTotalWrapper.classList.remove('hidden');
        cartTotalWrapper.innerHTML = `<p>Total:</p><p>৳${totalPrice}</p>`;
    } else {
        cartTotalWrapper.classList.add('hidden');
    }
}

// Init
getCategory();
getAllTrees('https://openapi.programming-hero.com/api/plants');