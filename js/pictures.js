'use strict';
(function() {

  var filterMenu = document.querySelector('.filters');

  filterMenu.classList.add('hidden');

  var container = document.querySelector('.pictures');

  var filters = document.querySelectorAll('.filters-radio');

  var pictures = [];

  var activeFilter = 'filter-popular';

  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  getPictures();

  function renderPictures(pictures) {
    container.innerHTML = '';

    pictures.forEach(function(picture, idx, array) {
      var element = getElementFromTemplate(picture);
      container.appendChild(element);
      if (idx === array.length - 1) {
        filterMenu.classList.remove('hidden');
      }
      console.log(pictures);
    });
  }

  function setActiveFilter(id) {
    if (activeFilter === id) {
      return;
    }

    document.querySelector('#' + activeFilter).checked = false;
    document.querySelector('#' + id).checked = true;

    var filteredPictures = pictures.slice(0);
    //console.log(filteredPictures);

    switch (id) {
      case 'filter-popular':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return a.date - b.date; });
        break;
      case 'filter-new':
        //filteredPictures = filteredPictures.sort(function(a, b) {return b - a;});
        filteredPictures = filteredPictures;
    }

    renderPictures(filteredPictures);
  }

  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    //xhr.open('GET', 'api.openweathermap.org/data/2.5/weather?q=London', true);
    xhr.onload = function(evt) {
      var rawData = evt.srcElement.response;
      var loadedPictures = JSON.parse(rawData);
      renderPictures(loadedPictures);
      //console.log(evt);
      //console.log(loadedPictures);
    };
    xhr.send();
    xhr.timeout = 10000;
  }


  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var element;

    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.childNodes[0].cloneNode(true);
    }

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    var templateImage = element.querySelector('img');
    var bgImage = new Image(182, 182);
    bgImage.src = data.url;
    bgImage.onload = function() {
      element.replaceChild(bgImage, templateImage);
    };

    bgImage.onerror = function() {
      element.classList.add('picture-load-failure');
      setTimeout(function() {
        bgImage.src = '';
        element.classList.add('picture-load-failure');
      }, 10000);
    };
    return element;
  }
})();

