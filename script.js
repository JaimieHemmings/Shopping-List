const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    
    //Validation of Input
    if (newItem === '') {
        alert('Please add an Item');
        return;
    }

    //Check for Edit Mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();

        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert('That item already exists');
            itemInput.value = '';
            return;
        }
    }

    //Create item DOM element
    addItemToDOM(newItem);

    //Add item to local storage
    addItemToStorage(newItem);

    checkUI();
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);
    itemInput.value = '';
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);
    //Stringify
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('editMode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228b22';
    itemInput.value = item.textContent;
}

//Delete items from the list
function removeItem(item) {
    if (confirm('Are you sure?')) {
        //Remove item from DOM
        item.remove();

        //Remove Item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter Item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //Reset Local Storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Delete all current items in the list
function clearItems() {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //Clear Local Storage
    localStorage.removeItem('items');

    checkUI();
}

//Filter Functionality
function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

//Reset State if no items in list
function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');

    if(items.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//Initialise
function init() {
    //Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems)
}

init();

