//*Select items*
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const submitBtn = document.querySelector(".submit-btn");
const grocery = document.querySelector("#grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//Edit option
let editElement;
let editFlag = false;
let editID = "";

//*Event Listeners*
//submit form
form.addEventListener("submit", addItem);
//clearitems
clearBtn.addEventListener("click", clearItems);
//load items
window.addEventListener("DOMContentLoaded", setupItems);

//*Functions*
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;

  const id = new Date().getTime().toString();
  if (value !== "" && editFlag === false) {
    createListItem(id, value);
    //display alert
    displayAlert("item added to the list", "success");
    //make container visible
    container.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag === true) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear Items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

//delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.length === 0) {
    container.classList.remove("show-container");
    /*clearBtn.display = "none";*/
  }
  displayAlert("item removed", "danger");
  //remove from local storage
  removeFromLocalStorage(id);
}

//edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

//set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

//*Local Storage*
//add
function addToLocalStorage(id, value) {
  const grocery = { id: id, value: value };
  console.log(grocery);
  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
//remove
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
    localStorage.setItem("list", JSON.stringify(items));
  });
}
//edit
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//getLocalSotrage ternary operator for get/remove/edit LS
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//*Setup Items*
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const item = document.createElement("article");
  //add class
  item.classList.add("grocery-item");
  //add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  item.setAttributeNode(attr);
  item.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <img src="checkbox.png" />
              </button>
              <button type="button" class="delete-btn">
                <img src="trash-bin.png" />
              </button>
            </div>`;
  const deleteBtn = item.querySelector(".delete-btn");
  const editBtn = item.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  //append child
  list.appendChild(item);
}

////////////////////////
// the simple way
/* without Local Storage

const submitBtn = document.querySelector(".submit-btn");
const grocery = document.querySelector("#grocery");
const container = document.querySelector(".grocery-container");

submitBtn.addEventListener("click", addItem);
function addItem(e) {
  e.preventDefault();
  const item = document.createElement("item");
  item.innerText = grocery.value;
  item.classList.add("toDoAdded");
  container.appendChild(item);

  grocery.value = "";

  //click on item to mark it as completed

  item.addEventListener("click", completeItem);
  function completeItem() {
    item.classList.add("finished");
  }

  // double click on item to delete it

  item.addEventListener("dblclick", deleteItem);
  function deleteItem() {
    container.removeChild(item);
  }
}*/
