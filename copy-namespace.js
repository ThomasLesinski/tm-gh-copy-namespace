// ==UserScript==
// @name         GitHub Shopware - Copy namespace
// @namespace    https://www.ottscho-it-service.de/
// @version      1
// @description  Add btn to copy namespace
// @author       Thomas Lesinski
// @include      https://github.com/shopware/platform/*
// @include      https://github.com/shopware/shopware/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const addCopyNamespaceBtnInterval = setInterval(addCopyNamespaceBtn, 250);

  function addCopyNamespaceBtn() {
    const btnExistsAlready = document.querySelector('.btn-copy-namespace');

    if (btnExistsAlready) {
      return;
    }

    const fileNamespace = getNamespace();
    let additionalClass = '';

    if (fileNamespace === 'hide') {
      clearInterval(addCopyNamespaceBtnInterval);
      
      return;
    } else if (fileNamespace === '') {
      additionalClass = 'disabled';
    }

    const copyNamespaceInput = createCopyNamespaceInput(fileNamespace);
    const copyNamespaceBtn = createCopyNamespaceBtn(additionalClass, copyNamespaceInput);

    let goToFileBtn = document.querySelector('.js-pjax-capture-input');

    if (!goToFileBtn) {
      goToFileBtn = document.querySelector('.file-navigation .btn.mr-2.d-none.d-md-block');
    }

    const GoToFileBtnParentEl = goToFileBtn.parentNode;

    document.querySelector('body').append(copyNamespaceInput);
    GoToFileBtnParentEl.insertBefore(copyNamespaceBtn, goToFileBtn);

    function createCopyNamespaceInput(fileNamespace) {
      const copyNamespaceInput = document.createElement('input');
      copyNamespaceInput.type = 'text';
      copyNamespaceInput.style.opacity = '0';
      copyNamespaceInput.value = fileNamespace;

      return copyNamespaceInput;
    }

    function createCopyNamespaceBtn(additionalClass, copyNamespaceInput) {
      const copyNamespaceBtn = document.createElement('div');
      copyNamespaceBtn.innerHTML = 'Copy namespace';
      copyNamespaceBtn.classList.add('btn-copy-namespace', 'btn', 'mr-2', 'd-none', 'd-md-block');

      if (additionalClass !== '') {
        copyNamespaceBtn.classList.add(additionalClass);
      }

      copyNamespaceBtn.addEventListener('click', () => {
        copyNamespaceInput.select();
        document.execCommand("copy");
      });

      return copyNamespaceBtn;
    }

    function getNamespace() {
      const namespaceArr = [];
      let namespaceString = '';

      let foundFirstIndicator = false;
      let foundSecondIndicator = false;

      const pathSegments = document.querySelectorAll('.file-navigation .js-path-segment').length > 0 ? document.querySelectorAll('.file-navigation .js-path-segment') : document.querySelectorAll('#blob-path .js-path-segment');

      if (pathSegments.length > 0) {
        const finalPathSegment = document.querySelector('.final-path').innerText.trim();

        if (finalPathSegment.includes('.php')) {
          pathSegments.forEach((pathSegment) => {
            const pathSegmentText = pathSegment.innerText.trim();

            if (foundFirstIndicator && foundSecondIndicator && pathSegmentText !== 'Shopware') {
              namespaceArr.push(pathSegmentText);
            }

            if (!foundFirstIndicator && (pathSegmentText === 'shopware' || pathSegmentText === 'platform')) {
              foundFirstIndicator = true;
            }

            if (!foundSecondIndicator && ((pathSegmentText === 'engine' || pathSegmentText === 'library') || pathSegmentText === 'src')) {
              foundSecondIndicator = true;
            }
          });

          if (namespaceArr.length > 0) {
            namespaceArr.push(finalPathSegment.replace('.php', ''));
            namespaceString = 'use Shopware\\' + namespaceArr.join('\\') + ';';
          }
        } else {
          return 'hide';
        }
      }

      return namespaceString;
    }
  }
})();
