/* global pictures: true */
'use strict';
(function() {

  var filterMenu = document.querySelector('.filters');

  if (filterMenu.classList.contains('hidden')) {
    true;
  } else {
    filterMenu.classList.add('hidden');
  };

  var container = document.querySelector('.pictures');
  pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
    filterMenu.classList.remove('hidden');
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var element = template.content.children[0].cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    var templateImage = element.querySelector('img');
    var bgImage = new Image();
    bgImage.src = data.url;
    bgImage.onload = function() {
      element.replaceChild(bgImage, templateImage);
      bgImage.width = '182';
      bgImage.style.height = '182px';
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

