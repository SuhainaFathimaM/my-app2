
let bagItems;
const apiUrl = 'https://api.escuelajs.co/api/v1/products';
const CONVENIENCE_FEES = 99;
let bagItemObjects;

document.addEventListener('DOMContentLoaded', function () {
  onLoad();
});

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  fetchItemsAndDisplay();
  displayBagIcon();
}

function fetchItemsAndDisplay() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(items => {
      console.log('Fetched items:', items);
      loadBagItems(items);
      displayItemsOnHomePage(items);
      displayBagItems();
      displayBagSummary();
    })
    .catch(error => {
      console.error('Error fetching items:', error);
    });
}

function loadBagItems(items) {
  const storedBagItems = localStorage.getItem('bagItems');
  bagItems = storedBagItems ? JSON.parse(storedBagItems) : [];
  console.log('Loaded bag items:', bagItems);

  bagItemObjects = bagItems.map(itemID => {
    const foundItem = items.find(item => item.id === itemID);
    return foundItem || null;
  });
  console.log('Mapped bag items:', bagItemObjects);
}

function displayItemsOnHomePage(items) {
  let itemsContainerElement = document.querySelector('.itemscontainer');
  if (!itemsContainerElement) {
    return;
  }
  let innerHtml = '';
  if (items && items.length > 0) {
    items.forEach(item => {
      let category = item.category.id;
      let description = item.description;
      let name = 'Myntra';
      let price = item.price;
      let current_price = price + 1000;
      let original_price = current_price + 1000;
      let discount_percentage = Math.round((original_price - current_price) / original_price * 100);
      let rating = item.rating;
      let count = Math.round((Math.random() * 10000 + 1000));
      let id = item._id;

      innerHtml += `
        <div class="item-container">
          <img class="item-image" src="${item.images[0]}" alt="item image">
          <div class="rating">
              ${category} ⭐ | ${count} Ratings
          </div>
          <div class="company-name">${description}</div>
          <div class="item-name">${name}</div>
          <div class="price">
              <span class="current-price">Rs ${current_price}</span>
              <span class="original-price">Rs ${original_price}</span>
              <span class="discount">(${discount_percentage}% OFF)</span>
          </div>
          <button class="btn-add-bag" onclick="addToBag('${id}')">Add to Bag</button>
        </div>`;
    });
  }
  itemsContainerElement.innerHTML = innerHtml;
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector('.bag-item-count');
  if (bagItems.length > 0) {
    console.log('I am here');
    bagItemCountElement.style.visibility = 'visible';
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = 'hidden';
  }
}

function displayBagItems() {
  let container = document.querySelector('.bag-items-container');
  let innerHTML = '';
  bagItemObjects.forEach(bagItem => {
    if (bagItem) {
      innerHTML += generateitemHTML(bagItem);
    }
  });
  container.innerHTML = innerHTML;
}

function displayBagSummary() {
  let bagSummaryElement = document.querySelector('.bag-summary');
  let totalItem = bagItemObjects.length;
  let totalMRP = 0;
  let totalDiscount = 0;
  console.log('Summary');
  bagItemObjects.forEach(bagItem => {
    console.log(bagItem);
    totalMRP += original_price;
    totalDiscount += original_price - current_price;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;
  console.log(finalPayment);
  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} Items) </div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">₹${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount"> ₹${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">₹${CONVENIENCE_FEES}</span>
      </div>
      <hr>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">₹${finalPayment}</span>
      </div>
    </div>
    <button class="btn-place-order">
      <div class="css-xjhrni">PLACE ORDER</div>
    </button>
  `;
}

// function displayBagSummary() {
//   let bagSummaryElement = document.querySelector('.bag-summary');
//   let totalItem = bagItemObjects.length;
//   let totalMRP = 0;
//   let totalDiscount = 0;
//   console.log('Summary');

//   bagItemObjects.forEach(bagItem => {
//     // Check if bagItem is not null and has the required properties
//     if (bagItem && bagItem.original_price && bagItem.current_price) {
//       totalMRP += bagItem.original_price;
//       totalDiscount += bagItem.original_price - bagItem.current_price;
//     }
//   });

//   let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

//   bagSummaryElement.innerHTML = `
//     <div class="bag-details-container">
//       <div class="price-header">PRICE DETAILS (${totalItem} Items) </div>
//       <div class="price-item">
//         <span class="price-item-tag">Total MRP</span>
//         <span class="price-item-value">₹${totalMRP}</span>
//       </div>
//       <div class="price-item">
//         <span class="price-item-tag">Discount on MRP</span>
//         <span class="price-item-value priceDetail-base-discount"> ₹
//         ${totalDiscount}</span>
//       </div>
//       <div class="price-item">
//         <span class="price-item-tag">Convenience Fee</span>
//         <span class="price-item-value">₹${CONVENIENCE_FEES}</span>
//       </div>
//       <hr>
//       <div class="price-footer">
//         <span class="price-item-tag">Total Amount</span>
//         <span class="price-item-value">₹${finalPayment}</span>
//       </div>
//     </div>
//     <button class="btn-place-order">
//       <div class="css-xjhrni">PLACE ORDER</div>
//     </button>
//   `;
// }


function removeFromBag(itemID) {
  bagItems = bagItems.filter(bagItemID => bagItemID != itemID);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  fetchItemsAndDisplay();
  displayBagSummary();
}

function generateitemHTML(item) {
  item.name = 'Myntra';
  let original_price = item.price + 2000;
  let current_price = item.price + 1000;
  let discount_percentage = Math.round((original_price - current_price) / original_price * 100);
  let return_period = 14;
  let delivery_date = 'January 15, 2024';

  return `
    <div class="bag-item-container">
      <div class="item-left-part">
        <img class="bag-item-img" src="${item.images[0]}">
      </div>
      <div class="item-right-part">
        <div class="company">${item.description}</div>
        <div class="item-name">${item.name}</div>
        <div class="price-container">
          <span class="current-price">Rs ${current_price}</span>
          <span class="original-price">Rs ${original_price}</span>
          <span class="discount-percentage">${discount_percentage}% OFF</span>
        </div>
        <div class="return-period">
          <span class="return-period-days">${return_period} days</span> return available
        </div>
        <div class="delivery-details">
          Delivery by
          <span class="delivery-details-days">${delivery_date}</span>
        </div>
      </div>
      <div class="remove-from-cart" onclick="removeFromBag('${item.id}')">X</div>
    </div>`;
}

function addToBag(itemId) {
  const stringItemId = itemId.toString();

  if (!bagItems.includes(stringItemId)) {
    bagItems.push(stringItemId);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    displayBagIcon();
    fetchItemsAndDisplay();
  } else {
    console.log('Item is already in the bag');
  }
}
