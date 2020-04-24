"use strict";

var my_list = [];

window.onload = function () {
  my_list = getOpenItems();
  if (my_list) {
    render();
    apiDragdop();
  }
}

function getOpenItems() {
  let my_list = [
    { name: "Movies to watch", openItems: ["Interstella", "DogCat"] },
    { name: "Yooooo", openItems: [] }
  ]
  return my_list;
}

function addNewList() {
  let name = document.getElementById('input_item').value;
  if (name !== '') {
    let item = {
      name: name,
      openItems: []
    }
    my_list.push(item);
    renderNewList(item);
  }
  document.getElementById('input_item').value = null;
}

function render() {
  document.getElementById('list-item-data').innerHTML = '';
  my_list.forEach(item => {
    let open_items = item.openItems;
    let slug = convertToSlug(item.name);
    let html_li = ``;
    if (open_items.length > 0) {
      open_items.forEach(item => {
        let slug_item = convertToSlug(item);
        let tag_li = `
              <li draggable="true" class="drag-task" id=li-${slug}-${slug_item}>
                <input class="styled-checkbox" id=${slug}-${item} type="checkbox">
                <label for=${slug}-${item}>${item}</label>
                <span id="btn-delete" class="btn-delete" onclick='deleteLi(\"${slug}\",\"${item}\")'>&#10005</span>
              </li>
            `
        html_li += tag_li;
      })
    }
    const html = `
            <div class="list-item">
            <div class="title">
              <div id="title-info-${slug}" class="title-info">
                <span id="edit-title" onclick='editItem(\"${slug}\")'>${item.name}</span>
                <div class="icons">
                  <span id="add-item" class="icon-sm" onclick='addOpenItem(\"${item.name}\", \"${slug}\")'><img src="images/icon/add.svg" alt=""></span>
                  <span id="delete-item" class="icon-sm" onclick='deleteItem(\"${item.name}\")'><img src="images/icon/delete.svg" alt=""></span>
                </div>
              </div>
              <div id="title-add-${slug}" class="title-add display-none">
                <input id="input-${slug}" type="text" placeholder="${item.name}">
                <span class="icon-sm" onclick='saveItem(\"${item.name}\",\"${slug}\")'><img src="images/icon/save.svg" alt=""></span>
              </div>
            </div>
            <div class="content">
              <div id="ioitem-${slug}" class="add-new-item display-none">
                <input type="text" placeholder="New item">
              </div>
              <ul class="drag-box" id="${slug}">
                ${html_li}
              </ul>
            </div>
          </div>
        `;
    document.getElementById('list-item-data').innerHTML += html;
  })
  apiDragdop();
}

function renderNewList(item) {
  let html_li = ``;
  let slug = convertToSlug(item.name);
  const html = `
      <div class="list-item">
      <div class="title">
        <div id="title-info-${slug}" class="title-info">
          <span id="edit-title" onclick='editItem(\"${slug}\")'>${item.name}</span>
          <div class="icons">
            <span id="add-item" class="icon-sm" onclick='addOpenItem(\"${item.name}\", \"${slug}\")'><img src="images/icon/add.svg" alt=""></span>
            <span id="delete-item" class="icon-sm" onclick='deleteItem(\"${item.name}\")'><img src="images/icon/delete.svg" alt=""></span>
          </div>
        </div>
        <div id="title-add-${slug}" class="title-add display-none">
          <input id="input-${slug}" type="text" placeholder="${item.name}">
          <span class="icon-sm" onclick='saveItem(\"${item.name}\", \"${slug}\")'><img src="images/icon/save.svg" alt=""></span>
        </div>
      </div>
      <div class="content">
        <div id="ioitem-${slug}" class="add-new-item display-none">
          <input type="text" placeholder="New item">
        </div>
        <ul class="drag-box" id="${slug}">
          ${html_li}
        </ul>
      </div>
    </div>
  `;
  document.getElementById('list-item-data').innerHTML += html;
  apiDragdop();
}

function deleteItem(name) {
  my_list = my_list.filter(i => i.name !== name);
  render();
}

function editItem(slug) {
  var title_info = document.getElementById(`title-info-${slug}`);
  title_info.classList.add("display-none");
  var el = document.getElementById(`title-add-${slug}`);
  el.classList.remove("display-none");
}

function saveItem(name, slug) {
  var title_info = document.getElementById(`title-info-${slug}`);
  title_info.classList.remove("display-none");
  var el = document.getElementById(`title-add-${slug}`);
  el.classList.add("display-none");
  var val = document.getElementById(`input-${slug}`).value;
  my_list.forEach(i => {
    if (i.name == name) {
      i.name = val;
    }
  })

  render();

}

function convertToSlug(Text) {
  return Text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    ;
}

function addOpenItem(name, slug) {
  var io = document.getElementById(`ioitem-${slug}`);
  io.classList.remove("display-none");
  document.onkeyup = function (evt) {
    evt = evt || window.event;
    let c = document.activeElement;
    let pr = c.parentNode;
    if (evt.key == 'Escape') {
      pr.classList.add("display-none");
    }
    if (evt.key == 'Enter') {
      let id = pr.id.slice(7);
      var ck = document.querySelector(`ul[id=${id}]`);
      var elChild = document.createElement('li');
      let vl = pr.firstElementChild.value;
      let slug_item = convertToSlug(vl);
      elChild.setAttribute("draggable", true)
      elChild.setAttribute("class", "drag-task")
      elChild.id = `li-${slug}-${slug_item}`;
      let tag_li = `
        <input class="styled-checkbox" id=${slug}-${vl} type="checkbox">
        <label for=${slug}-${vl}>${vl}</label>
        <span id="btn-delete" class="btn-delete" onclick='deleteLi(\"${slug}\",\"${vl}\")'>&#10005</span>
      `;
      elChild.innerHTML = tag_li;
      if (!ck) { return; }
      ck.appendChild(elChild);
      my_list.forEach(i => {
        if (i.name == name) {
          i.openItems.push(vl);
          i.openItems.sort();
        }
      })
      apiDragdop();
    }
  }
}

function deleteLi(slug, vl) {
  let slug_item = convertToSlug(vl);
  var li_item = document.querySelector(`li[id=li-${slug}-${slug_item}]`);
  li_item.remove();
}

function apiDragdop() {
  var dropTarget = document.querySelector(".drop-target.list");
  var draggables = document.querySelectorAll(".drag-task");

  // Tells the other side what data is being passed (e.g. the ID is targeted)
  draggables.forEach(item => {
    item.addEventListener("dragstart", function (ev) {
      ev.dataTransfer.setData("srcId", ev.target.id);
    });
  })
  // The end destination, prevent browsers default drag and drop (disabling breaks feature)
  // because it's disabled by browsers by default
  dropTarget.addEventListener('dragover', function (ev) {
    ev.preventDefault();
  });
  // End destination where item is dropped into
  dropTarget.addEventListener('drop', function (ev) {
    ev.preventDefault();
    let target = ev.target;
    let droppable = target.classList.contains('drag-box');
    let srcId = ev.dataTransfer.getData("srcId");
    if (droppable) {
      ev.target.appendChild(document.getElementById(srcId));
    }
  });
}