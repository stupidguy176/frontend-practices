var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('items'),
    sliderList = document.getElementById('sliderList'),
    sliderItemsList = document.getElementById('itemsList');

slide(slider, sliderItems);
slide(sliderList, sliderItemsList);

function slide(wrapper, items) {
  var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = items.getElementsByClassName('slide'),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;

    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');
    items.onmousedown = dragStart;
    items.addEventListener('touchmove', dragAction);
    items.addEventListener('transitionend', checkIndex);
  
  function dragStart (e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = items.offsetLeft;
    posX1 = e.clientX;
    document.onmouseup = dragEnd;
    document.onmousemove = dragAction;
  }

  function dragAction(e) {
    e = e || window.event;
    posX2 = posX1 - e.clientX;
    posX1 = e.clientX;
    items.style.left = (items.offsetLeft - posX2) + "px";
  }

  function dragEnd(e) {
    console.log('dragEnd');
    posFinal = items.offsetLeft;
    console.log('posFinal - posInitial', posFinal - posInitial);
    if (posFinal - posInitial < -threshold) {
      // keo qua
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      // keo ve
      shiftSlide(-1, 'drag');
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');
    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }
      if (dir == 1) {
        // keo qua
        items.style.left = (posInitial - slideSize) + "px";
        index++;      
      } else if (dir == -1) {
        // keo ve
        items.style.left = (posInitial + slideSize) + "px";
        index--;      
      }
    };
    allowShift = false;
  }

  function checkIndex (){
    items.classList.remove('shifting');
    if (index == -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }
    if (index == slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }
    allowShift = true;
  }

}
