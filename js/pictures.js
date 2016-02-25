'use strict';
(function() {

  var filterMenu = document.querySelector('.filters');

  filterMenu.classList.add('hidden');

  var container = document.querySelector('.pictures');

  var filters = document.querySelectorAll('.filters-radio');

  var pictures = [];

  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  getPictures();

  function renderPictures(data) {
    container.innerHTML = '';

    data.forEach(function(picture, idx, array) {
      var element = getElementFromTemplate(picture);
      container.appendChild(element);
      if (idx === array.length - 1) {
        filterMenu.classList.remove('hidden');
      }
    });
  }

  function setActiveFilter(id) {
    document.querySelector('#' + id).checked = true;

    var filteredPictures = pictures.slice();
    var currentDate = new Date();

    switch (id) {
      case 'filter-popular':
        filteredPictures = pictures;
        break;
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        }).filter(function(item) {
          return new Date(item.date) >= (currentDate.getTime() - (14 * 24 * 60 * 60 * 1000));
        })
        ;
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    renderPictures(filteredPictures);
  }

  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json', true);
    xhr.onload = function(evt) {
      var rawData = evt.srcElement.response;
      var loadedPictures = JSON.parse(rawData);
      pictures = loadedPictures;
      renderPictures(loadedPictures);
    };
    xhr.onerror = function() {
      container.classList.add('pictures-failure');
    };
    xhr.send();
    xhr.timeout = 10000;
  }

  function getElementFromTemplate(data) {
    container.classList.add('pictures-loading');
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
      container.classList.remove('pictures-loading');
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

