"use strict";

var my_list = [];

var droppables = new Array();
var itemBeingDragged = null;
var mouseDownPoint = { x: 0, y: 0 };

function onDocumentMouseMove(mouseMoveEvent) {
  var point = { x: mouseMoveEvent.pageX, y: mouseMoveEvent.pageY };

  // Drag the draggable to this position
  itemBeingDragged.dragTo(point);

  // If there are any droppable elements at this position, notify them
  for (var i = 0; i < droppables.length; i++) {
    if (droppables[i].contains(point) && !droppables[i].isBeingDraggedOver) {
      droppables[i].onDragEnter();
    } else if (!droppables[i].contains(point) && droppables[i].isBeingDraggedOver) {
      droppables[i].onDragExit();
    }
  }
}

function onDocumentMouseUp(mouseUpEvent) {
  // If any droppable is being dragged over, accept the drop
  for (var i = 0; i < droppables.length; i++) {
    if (droppables[i].isBeingDraggedOver) {
      droppables[i].onDragDrop(itemBeingDragged);
    }
  }

  // Reset the position of the item being dragged and clear out the document event handlers
  itemBeingDragged.reset(mouseUpEvent);
}

var Draggable = function (elementId) {
  this.init(elementId);
};

Draggable.prototype = {
  init: function (element) {
    if (typeof element === "string") element = document.getElementById(element);

    this.element = element;
    if (!this.element.classList.contains('draggable')) {
      this.element.className += "draggable";
    }

    var self = this;

    this.element.onmousedown = function (mouseDownEvent) {
      this.style.zIndex = "1000";

      itemBeingDragged = self;

      mouseDownPoint.x = mouseDownEvent.pageX;
      mouseDownPoint.y = mouseDownEvent.pageY;

      document.onmousemove = onDocumentMouseMove;
      document.onmouseup = onDocumentMouseUp;
    };
  },

  // Called when the mouse is moved (after having been pressed on this element)
  dragTo: function (point) {
    this.element.style.left = (point.x - mouseDownPoint.x) + "px";
    this.element.style.top = (point.y - mouseDownPoint.y) + "px";
    this.element.classList.add('moving-element');
  },

  // Called when the mouse is lifted (after having been pressed on this element)
  reset: function () {
    this.element.style.zIndex = "";
    this.element.style.left = "";
    this.element.style.top = "";
    this.element.classList.remove('moving-element');

    itemBeingDragged = null;

    mouseDownPoint.x = 0;
    mouseDownPoint.y = 0;

    document.onmousemove = null;
    document.onmouseup = null;
  }
};

// customDragDrop is a custom function which will be called when a Draggable is dropped
// on this Droppable; it is passed the Draggable that was dropped
var Droppable = function (element, customDragDrop) {
  this.init(element, customDragDrop);
};

Droppable.prototype = {
  init: function (element, customDragDrop) {
    if (typeof element === "string") element = document.getElementById(element);
    this.element = element;
    this.isBeingDraggedOver = false;
    this.customDragDrop = customDragDrop;
    droppables.push(this);
  },

  // Calculate the top-left coordinate of this element
  position: function () {
    var position = { x: this.element.offsetLeft, y: this.element.offsetTop };
    var offsetParent = this.element.offsetParent;
    while (offsetParent) {
      position.x += offsetParent.offsetLeft;
      position.y += offsetParent.offsetTop;
      offsetParent = offsetParent.offsetParent;
    }
    return position;
  },

  // Calculate whether the given coordinate falls within this element's boundaries
  contains: function (point) {
    var topLeft = this.position();
    var bottomRight = {
      x: topLeft.x + this.element.offsetWidth,
      y: topLeft.y + this.element.offsetHeight
    };
    return (
      (topLeft.x < point.x && topLeft.y < point.y)
      ||
      (point.x < bottomRight.x && point.y < bottomRight.y)
    );

  },

  // Called when an item is dragged into this element
  onDragEnter: function () {
    this.isBeingDraggedOver = true;
    this.element.className += "dragOver";
  },

  // Called when an item is dragged out of this element
  onDragExit: function () {
    this.isBeingDraggedOver = false;
    this.element.className = this.element.className.replace(/\bdragOver\b/, "");
  },

  // Called when an item is dropped on this element
  onDragDrop: function (draggable) {
    this.onDragExit();
    this.customDragDrop(draggable);
  }
};

function touchHandler(event) {
  var touches = event.changedTouches,
    first = touches[0],
    type = "";
  switch (event.type) {
    case "touchstart": type = "mousedown"; break;
    case "touchmove": type = "mousemove"; break;
    case "touchend": type = "mouseup"; break;
    default: return;
  }

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
    first.screenX, first.screenY,
    first.clientX, first.clientY, false,
    false, false, false, 0/*left*/, null);

  first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}

function mapDocumentTouchToMouse() {
  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
}

mapDocumentTouchToMouse();

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
  initDragdrop();
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
  initDragdrop();
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

function initDragdrop() {
  my_list.forEach(item => {
    let slug = convertToSlug(item.name);
    var ul = document.querySelector(`ul[id=${slug}]`);

    let open_items = item.openItems;
    open_items.forEach(item => {
      let slug_item = convertToSlug(item);
      var liElement = document.querySelector(`li[id=li-${slug}-${slug_item}]`);
      var liElementDraggable = new Draggable(liElement);
    })

    var availableMetricsDroppable = new Droppable(ul, function (draggable) {
      if (this.element !== draggable.element.parentNode) {
        this.element.appendChild(draggable.element);
      }
    });
  })
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