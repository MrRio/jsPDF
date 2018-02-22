/**
 * jsPDF Dialog PlugIn
 * Copyright (c) 2018 Aras Abbasi <aras.abbasi@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
  'use strict';
  
  var dialog = undefined;
  var totalText;
  var pdfPreviewContainer;
  var resizeEventIsHooked = false;
  var marginOfDialogToViewport = 30;
  var leftPanelWidth = 240;
  var currentJsPDFObject;
  var pageRangeRegex = /^[0-9]+(?:(?:\s*,\s*|-)[0-9]+)*/g;
  
  var paperSizes = ['A0','A1','A3','A4','A5','A6','A7','A8','A9','A10',
                    'B0','B1','B3','B4','B5','B6','B7','B8','B9','B10',
                    'C0','C1','C3','C4','C5','C6','C7','C8','C9','C10',
                    'DL','Letter','Government Letter','Junior Legal','Ledger','Tabloid','Credit Card'];
  var defaultPaperSize = 'A4';
  var labels;
  var hidePanels;
  
  function showDialog(options) {
    var event = document.createEvent('Event');
    event.initEvent('applyChanges', true, true);
    
    var defaultFileName = options.defaultFileName || 'download.pdf';
    
    hidePanels = Object.assign({
      fileName : false,
      pageRange: false,
      layout: false,
      paperSize: false,
      margins: false,
      options: false
    }, options.hidePanels);

    labels = Object.assign({
      title: 'jsPDF',
      total: 'Total:',
      page: 'Page',
      pages: 'Pages',
      save: 'Save',
      cancel: 'Cancel',
      filename: 'Filename',
      all: 'All',
      layout: 'Layout',
      portrait: 'Portrait',
      landscape: 'Landscape',
      paperSize: 'Paper size',
      margins: 'Margins',
      'default': 'Default',
      none: 'None',
      minimal: 'Minimal',
      options: 'Options',
      headersAndFooters: 'Headers and footers',
      backgroundImages: 'Background images'
    }, options.labels);
    
    var saveCallback = (typeof options.callback === 'function') ? options.callback : function() {};
    
    dialog = document.createElement('form');
    dialog.name = 'dialogForm';
    dialog.id = 'jsPDFDialogForm';
    if (typeof options.processingFunction === 'function') {      
      dialog.addEventListener('applyChanges', function (e) {
        var formValues = getFormValues();
        var tmpJsPDFObject;
        var showJsPDFObjectInPreView = function(currentJsPDFObject) {
            if (formValues.pageRange && formValues.pageRange !== -1 && formValues.pageRange.length !== 0) {
                currentJsPDFObject = removePagesFromJsPDFObjectByPageRange(currentJsPDFObject, formValues.pageRange);
              }
            setPdfPreview(currentJsPDFObject);
        }
        tmpJsPDFObject = options.processingFunction(getFormValues(), showJsPDFObjectInPreView);
        if (typeof tmpJsPDFObject === "object") {
        	currentJsPDFObject = tmpJsPDFObject;
        	showJsPDFObjectInPreView(currentJsPDFObject);
        }
      }, false);
    }
    
    dialog.style.position = 'fixed';
    dialog.style.left = marginOfDialogToViewport + 'px';
    dialog.style.top = marginOfDialogToViewport + 'px';
    dialog.style.zIndex = 100;
    dialog.style.border = '1px solid #BEBEBE'
    dialog.style.backgroundColor = '#F7F7F7';
    dialog.style.fontFamily = 'Verdana';
    var leftPanel = document.createElement('div');
    leftPanel.style.width = leftPanelWidth;
    leftPanel.style.height = '100%';
    leftPanel.style.overflowX = 'hidden';
    leftPanel.style.overflowY = 'auto';
    
    var headerContainer = document.createElement('div');
    headerContainer.style.position = 'relative';
    headerContainer.style.float = 'left';
    headerContainer.style.width = leftPanelWidth;
    headerContainer.style.height = 110;
    headerContainer.style.borderBottom = '1px solid #BEBEBE';
    
    var titleLabel = document.createElement('span');
    titleLabel.textContent = labels.title;
    titleLabel.style.position = 'absolute';
    titleLabel.style.top = 16;
    titleLabel.style.left = 18;
    titleLabel.style.fontSize = '16px';
    headerContainer.appendChild(titleLabel);

    var totalLabel = document.createElement('label');
    totalLabel.textContent = labels.total;
    totalLabel.style.position = 'absolute';
    totalLabel.style.top = 44;
    totalLabel.style.left = 19;
    totalLabel.style.fontSize = '10px';
    
    totalText = document.createElement('b');
    totalText.textContent = '';
    totalText.style.paddingLeft = '5px';
    totalLabel.appendChild(totalText);
    headerContainer.appendChild(totalLabel);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = labels.cancel;
    cancelButton.style.position = 'relative';
    cancelButton.style.float = 'right';
    cancelButton.style.margin = '74px 20px 0 0';
    cancelButton.style.padding = '1px 9px';
    cancelButton.onclick = hideDialog;
    headerContainer.appendChild(cancelButton);

    var saveButton = document.createElement('button');
    saveButton.textContent = labels.save;
    saveButton.style.position = 'relative';
    saveButton.style.float = 'right';
    saveButton.style.margin = '74px 10px 0 0';
    saveButton.style.padding = '1px 9px';
    saveButton.onclick = function () {
      if (typeof options.processingFunction === 'function') {
          var formValues = getFormValues();
          var tmpJsPDFObject;
          var showJsPDFObjectInPreView = function(currentJsPDFObject) {
              if (formValues.pageRange && formValues.pageRange !== -1 && formValues.pageRange.length !== 0) {
                  currentJsPDFObject = removePagesFromJsPDFObjectByPageRange(currentJsPDFObject, formValues.pageRange);
                }
              currentJsPDFObject.save(formValues.fileName);
          }
          tmpJsPDFObject = options.processingFunction(getFormValues(), showJsPDFObjectInPreView);
          if (typeof tmpJsPDFObject === "object") {
          	currentJsPDFObject = tmpJsPDFObject;
          	currentJsPDFObject.save(formValues.fileName);
          }
      }
      saveCallback();
      hideDialog();
      return false;
    };
    headerContainer.appendChild(saveButton);
    
    var fileNameContainer = document.createElement('div');
    fileNameContainer.style.position = 'relative';
    fileNameContainer.style.float = 'left';
    fileNameContainer.style.clear = 'both';
    fileNameContainer.style.width = leftPanelWidth;
    fileNameContainer.style.height = 47;
    fileNameContainer.style.borderBottom = '1px solid #BEBEBE';
    
    var fileNameLabel = document.createElement('label');
    fileNameLabel.textContent = labels.filename;
    fileNameLabel.style.position = 'absolute';
    fileNameLabel.style.top = 17;
    fileNameLabel.style.left = 19;
    fileNameLabel.style.fontSize = '10px';
    fileNameContainer.appendChild(fileNameLabel);

    var fileNameTextbox = document.createElement('input');
    fileNameTextbox.id = 'jsPDFDialogFileName';
    fileNameTextbox.name = 'fileName';
    fileNameTextbox.style.float = 'left';
    fileNameTextbox.value = defaultFileName;
    fileNameTextbox.style.position = 'absolute';
    fileNameTextbox.style.top = 16;
    fileNameTextbox.style.left = 100;
    fileNameTextbox.style.width = 120;
    fileNameTextbox.style.fontSize = '10px';
    fileNameContainer.appendChild(fileNameTextbox);    
    
    var pageRangeContainer = document.createElement('div');
    pageRangeContainer.style.position = 'relative';
    pageRangeContainer.style.float = 'left';
    pageRangeContainer.style.clear = 'both';
    pageRangeContainer.style.width = leftPanelWidth;
    pageRangeContainer.style.height = 70;
    pageRangeContainer.style.borderBottom = '1px solid #BEBEBE';

    var pageRangeLabel = document.createElement('label');
    pageRangeLabel.textContent = labels.pages;
    pageRangeLabel.style.position = 'absolute';
    pageRangeLabel.style.top = 17;
    pageRangeLabel.style.left = 19;
    pageRangeLabel.style.fontSize = '10px';
    pageRangeContainer.appendChild(pageRangeLabel);

    var pageRangeAllLabel = document.createElement('label');
    pageRangeAllLabel.textContent = labels.all;
    pageRangeAllLabel.style.position = 'absolute';
    pageRangeAllLabel.style.top = 18;
    pageRangeAllLabel.style.left = 100;
    pageRangeAllLabel.style.textIndent = 5;
    pageRangeAllLabel.style.fontSize = '10px';

    var pageRangeAllRadio = document.createElement('input');
    pageRangeAllRadio.type = 'radio';
    pageRangeAllRadio.checked = 'checked';
    pageRangeAllRadio.value = 'all';
    pageRangeAllRadio.id = 'jsPDFDialogPageRangeAll';
    pageRangeAllRadio.name = 'pageRange';
    pageRangeAllRadio.style.float = 'left';
    pageRangeAllRadio.onchange = function () {
      dialog.dispatchEvent(event);
    };
    pageRangeAllLabel.appendChild(pageRangeAllRadio);

    pageRangeContainer.appendChild(pageRangeAllLabel);  

    var pageRangeSpecificLabel = document.createElement('label');
    pageRangeSpecificLabel.style.position = 'absolute';
    pageRangeSpecificLabel.style.top = 40;
    pageRangeSpecificLabel.style.left = 100;
    pageRangeSpecificLabel.style.textIndent = 5;

    var pageRangeSpecificRadio = document.createElement('input');
    pageRangeSpecificRadio.type = 'radio';
    pageRangeSpecificRadio.name = 'pageRange';
    pageRangeSpecificRadio.value = 'specific';
    pageRangeSpecificRadio.style.float = 'left';
    pageRangeSpecificRadio.onchange = function () {
      if (document.getElementById('jsPDFDialogPageRangeSpecific').value.length !== 0) {
    	  dialog.dispatchEvent(event);
      }
    };
    pageRangeSpecificLabel.appendChild(pageRangeSpecificRadio);

    var pageRangeSpecificTextbox = document.createElement('input');
    pageRangeSpecificTextbox.style.fontSize = '10px';
    pageRangeSpecificTextbox.id = 'jsPDFDialogPageRangeSpecific';
    pageRangeSpecificTextbox.style.width = 102;
    pageRangeSpecificTextbox.style.marginLeft = 5;
    pageRangeSpecificTextbox.style.float = 'left';
    pageRangeSpecificTextbox.onkeypress = function(evt) {
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        if (/\d|,|-/.test(charStr) !== true) {
            return false;
        }
    };
    pageRangeSpecificTextbox.onchange = function () {
      dialog.dispatchEvent(event);      
    };
    pageRangeSpecificLabel.appendChild(pageRangeSpecificTextbox);
    
    pageRangeContainer.appendChild(pageRangeSpecificLabel);
    
    var layoutContainer = document.createElement('div');
    layoutContainer.style.position = 'relative';
    layoutContainer.style.float = 'left';
    layoutContainer.style.clear = 'both';
    layoutContainer.style.width = leftPanelWidth;
    layoutContainer.style.height = 69;
    layoutContainer.style.borderBottom = '1px solid #BEBEBE';
    
    var layoutLabel = document.createElement('label');
    layoutLabel.textContent = labels.layout;
    layoutLabel.style.position = 'absolute';
    layoutLabel.style.top = 17;
    layoutLabel.style.left = 19;
    layoutLabel.style.fontSize = '10px';
    layoutContainer.appendChild(layoutLabel);

    var layoutPortraitLabel = document.createElement('label');
    layoutPortraitLabel.style.position = 'absolute';
    layoutPortraitLabel.textContent = labels.portrait;
    layoutPortraitLabel.style.top = 17;
    layoutPortraitLabel.style.left = 100;
    layoutPortraitLabel.style.fontSize = '10px';
    layoutPortraitLabel.style.textIndent = 5;
    
    var layoutPortraitRadio = document.createElement('input');
    layoutPortraitRadio.type = 'radio';
    layoutPortraitRadio.checked = 'checked';
    layoutPortraitRadio.name = 'layout';
    layoutPortraitRadio.id = 'jsPDFDialogLayoutPortrait';
    layoutPortraitRadio.value = 'portrait';
    layoutPortraitRadio.style.float = 'left';
    layoutPortraitRadio.onchange = function () {
      dialog.dispatchEvent(event);      
    };

    layoutPortraitLabel.appendChild(layoutPortraitRadio);

    layoutContainer.appendChild(layoutPortraitLabel);
    
    var layoutLandscapeLabel = document.createElement('label');
    layoutLandscapeLabel.style.position = 'absolute';
    layoutLandscapeLabel.textContent = labels.landscape;
    layoutLandscapeLabel.style.top = 39;
    layoutLandscapeLabel.style.left = 100;
    layoutLandscapeLabel.style.fontSize = '10px';
    layoutLandscapeLabel.style.textIndent = 5;
    
    var layoutLandscapeRadio = document.createElement('input');
    layoutLandscapeRadio.type = 'radio';
    layoutLandscapeRadio.name = 'layout';
    layoutLandscapeRadio.id = 'jsPDFDialogLayoutLandscape';
    layoutLandscapeRadio.value = 'landscape';
    layoutLandscapeRadio.style.float = 'left';
    layoutLandscapeRadio.onchange = function () {
      dialog.dispatchEvent(event);      
    };

    layoutLandscapeLabel.appendChild(layoutLandscapeRadio);
    layoutContainer.appendChild(layoutLandscapeLabel);

    var paperSizeContainer = document.createElement('div');
    paperSizeContainer.style.position = 'relative';
    paperSizeContainer.style.float = 'left';
    paperSizeContainer.style.clear = 'both';
    paperSizeContainer.style.width = leftPanelWidth;
    paperSizeContainer.style.height = 47;
    paperSizeContainer.style.borderBottom = '1px solid #BEBEBE';

    var paperSizeLabel = document.createElement('label');
    paperSizeLabel.textContent = labels.paperSize;
    paperSizeLabel.style.position = 'absolute';
    paperSizeLabel.style.top = 17;
    paperSizeLabel.style.left = 19;
    paperSizeLabel.style.fontSize = '10px';
    
    paperSizeContainer.appendChild(paperSizeLabel);

    var paperSizeDropdown = document.createElement('select');
    paperSizeDropdown.style.position = 'absolute';
    paperSizeDropdown.style.top = 16;
    paperSizeDropdown.style.left = 100;
    paperSizeDropdown.id = 'jsPDFDialogPaperSize',
    paperSizeDropdown.name = 'paperSize';  
    paperSizeDropdown.style.fontSize = '10px';
    paperSizeDropdown.style.width = 120;
    paperSizeDropdown.onchange = function () {
      dialog.dispatchEvent(event);      
    };
    
    for (var i=0; i < paperSizes.length; i += 1) {
      var paperSizeOption = document.createElement('option');
      paperSizeOption.value = paperSizes[i].toLowerCase().replace(' ', '-');
      paperSizeOption.textContent = paperSizes[i];
      if (paperSizes[i] === defaultPaperSize) {
        paperSizeOption.selected = "selected";
      }
      paperSizeDropdown.appendChild(paperSizeOption);
    }
    
    paperSizeContainer.appendChild(paperSizeDropdown);

    var marginsContainer = document.createElement('div');
    marginsContainer.style.position = 'relative';
    marginsContainer.style.float = 'left';
    marginsContainer.style.clear = 'both';
    marginsContainer.style.width = leftPanelWidth;
    marginsContainer.style.height = 47;
    marginsContainer.style.borderBottom = '1px solid #BEBEBE';

    var marginsLabel = document.createElement('label');
    marginsLabel.textContent = labels.margins;
    marginsLabel.style.position = 'absolute';
    marginsLabel.style.top = 17;
    marginsLabel.style.left = 19;
    marginsLabel.style.fontSize = '10px';
    
    marginsContainer.appendChild(marginsLabel);

    var marginsDropdown = document.createElement('select');
    marginsDropdown.style.position = 'absolute';
    marginsDropdown.id = 'jsPDFDialogMargins',
    marginsDropdown.name = 'margins',
    marginsDropdown.style.top = 16;
    marginsDropdown.style.left = 100;
    marginsDropdown.style.fontSize = '10px';
    marginsDropdown.style.width = 120;
    marginsDropdown.onchange = function () {
      dialog.dispatchEvent(event);      
    };
    
    var marginsDefaultOption = document.createElement('option');
    marginsDefaultOption.value = 'default';
    marginsDefaultOption.textContent = labels['default'];
    marginsDropdown.appendChild(marginsDefaultOption);

    var marginsNoneOption = document.createElement('option');
    marginsNoneOption.value = 'none';
    marginsNoneOption.textContent = labels.none;
    marginsDropdown.appendChild(marginsNoneOption);
    
    var marginsMinimalOption = document.createElement('option');
    marginsMinimalOption.value = 'minimal';
    marginsMinimalOption.textContent = labels.minimal;
    marginsDropdown.appendChild(marginsMinimalOption);

    marginsContainer.appendChild(marginsDropdown);

    var optionsContainer = document.createElement('div');
    optionsContainer.style.position = 'relative';
    optionsContainer.style.float = 'left';
    optionsContainer.style.clear = 'both';
    optionsContainer.style.width = leftPanelWidth;
    optionsContainer.style.height = 69;
    optionsContainer.style.borderBottom = '1px solid #BEBEBE';

    var optionsLabel = document.createElement('label');
    optionsLabel.textContent = labels.options;
    optionsLabel.style.position = 'absolute';
    optionsLabel.style.top = 17;
    optionsLabel.style.left = 19;
    optionsLabel.style.fontSize = '10px';
    
    optionsContainer.appendChild(optionsLabel);

    var headersAndFootersLabel = document.createElement('label');
    headersAndFootersLabel.style.position = 'absolute';
    headersAndFootersLabel.textContent = labels.headersAndFooters;
    headersAndFootersLabel.style.top = 17;
    headersAndFootersLabel.style.left = 100;
    headersAndFootersLabel.style.fontSize = '10px';
    headersAndFootersLabel.style.textIndent = 5;
    
    var headersAndFootersCheckbox = document.createElement('input');
    headersAndFootersCheckbox.type = 'checkbox';
    headersAndFootersCheckbox.checked = 'checked';
    headersAndFootersCheckbox.id = 'jsPDFDialogHeadersAndFooters';
    headersAndFootersCheckbox.name = 'headersAndFooters';
    headersAndFootersCheckbox.value = 'headersAndFooters';
    headersAndFootersCheckbox.style.float = 'left';
    headersAndFootersCheckbox.onchange = function () {
      dialog.dispatchEvent(event);
    };
    
    headersAndFootersLabel.appendChild(headersAndFootersCheckbox);
    optionsContainer.appendChild(headersAndFootersLabel);

    var backgroundImagesLabel = document.createElement('label');
    backgroundImagesLabel.style.position = 'absolute';
    backgroundImagesLabel.textContent = labels.backgroundImages;
    backgroundImagesLabel.style.top = 39;
    backgroundImagesLabel.style.left = 100;
    backgroundImagesLabel.style.fontSize = '10px';
    backgroundImagesLabel.style.textIndent = 5;
    
    var backgroundImagesCheckbox = document.createElement('input');
    backgroundImagesCheckbox.type = 'checkbox';
    backgroundImagesCheckbox.checked = 'checked';
    backgroundImagesCheckbox.id = 'jsPDFDialogBackgroundImages';
    backgroundImagesCheckbox.name = 'backgroundImages';
    backgroundImagesCheckbox.value = 'backgroundImages';
    backgroundImagesCheckbox.style.float = 'left';
    backgroundImagesCheckbox.onchange = function () {
      dialog.dispatchEvent(event);      
    };
    
    backgroundImagesLabel.appendChild(backgroundImagesCheckbox);
    optionsContainer.appendChild(backgroundImagesLabel);

    leftPanel.appendChild(headerContainer);
    if (hidePanels.fileName !== true) {
      leftPanel.appendChild(fileNameContainer);
    }
    if (hidePanels.pageRange !== true) {
      leftPanel.appendChild(pageRangeContainer);
    }    
    if (hidePanels.layout !== true) {
      leftPanel.appendChild(layoutContainer);
    }
    if (hidePanels.paperSize !== true) {
      leftPanel.appendChild(paperSizeContainer);
    }
    if (hidePanels.margins !== true) {
      leftPanel.appendChild(marginsContainer); 
    }
    if (hidePanels.options !== true) {
      leftPanel.appendChild(optionsContainer);
    }
    
    dialog.appendChild(leftPanel);
    
    pdfPreviewContainer = document.createElement('div');
    pdfPreviewContainer.style.position = 'absolute';
    pdfPreviewContainer.style.borderLeft = '1px solid #BEBEBE';
    pdfPreviewContainer.style.top = 0;
    pdfPreviewContainer.style.left = leftPanelWidth;
    pdfPreviewContainer.style.height = '100%';
    
    dialog.appendChild(pdfPreviewContainer);
    
    document.body.appendChild(dialog);
    if (resizeEventIsHooked === false) {
      window.addEventListener('resize', resizePrintDialog);
      resizeEventIsHooked = true;
    }
    resizePrintDialog();
    dialog.dispatchEvent(event);
  }
  
  function getFormValues() {
    var result = {};

    result.fileName = document.getElementById('jsPDFDialogFileName').value;
    
    if (hidePanels.pageRange !== true) {
      result.pageRange = (document.getElementById('jsPDFDialogPageRangeAll').checked) ? -1 : document.getElementById('jsPDFDialogPageRangeSpecific').value;
    }    
    if (hidePanels.layout !== true) {
      result.layout = (document.getElementById('jsPDFDialogLayoutPortrait').checked) ? 'portrait' : 'landscape';
    }
    if (hidePanels.paperSize !== true) {
      result.paperSize = document.getElementById('jsPDFDialogPaperSize').value;
    }
    if (hidePanels.margins !== true) {
      result.margins = document.getElementById('jsPDFDialogMargins').value;
    }
    if (hidePanels.options !== true) {
      result.headersAndFooters = document.getElementById('jsPDFDialogHeadersAndFooters').checked;
      result.backgroundImages = document.getElementById('jsPDFDialogBackgroundImages').checked;
    }
    return result;
  }
  
  function removePagesFromJsPDFObjectByPageRange(jsPDFObject, pageRange) {
    var regEx = /([0-9]+-[0-9]+)|([0-9]+)/ig;
    var match;
    var pagesToPrint=[];
    var i, rangeStart, rangeEnd, step, tmpValue;
    
    function unique(a) {
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = a[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    }
    
    match = regEx.exec(pageRange);
    while(match !== null) {
        if (match[0].indexOf("-") === -1) {
          pagesToPrint.push(parseInt(match[0],10));
        } else {
          tmpValue = match[0];
          rangeStart = parseInt(tmpValue.split("-")[0],10);
          rangeEnd = parseInt(tmpValue.split("-")[1],10);
          step = (rangeStart <= rangeEnd) ? 1 : -1;
          
          for (i = rangeStart; i <= rangeEnd; i += step){
            pagesToPrint.push(i);
          }
        }
      
        match = regEx.exec(pageRange);
    }
    pagesToPrint = unique(pagesToPrint);
    
    for (i = jsPDFObject.internal.getNumberOfPages(); i >= 1; i--) {
      if (pagesToPrint.indexOf(i) === -1) {
        jsPDFObject.deletePage(i);
      }
    }
    return jsPDFObject;
  }
  
  function resizePrintDialog() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

    dialog.style.width = (viewportWidth - 2 * marginOfDialogToViewport) + 'px';
    dialog.style.height = (viewportHeight - 2 * marginOfDialogToViewport) + 'px';
    pdfPreviewContainer.style.width = (viewportWidth - 2 * marginOfDialogToViewport - leftPanelWidth) + 'px';
  }
  
  function hideDialog() {
    document.body.removeChild(dialog);
  }
  
  function setPageTotalCount(pageCount) {
    pageCount = pageCount || 0;
    var pageLabelText = (pageCount > 1) ? labels.pages : labels.page;
    if (dialog === undefined) { return; };
    totalText.textContent = pageCount + ' ' + pageLabelText;
  }
  
  function setPdfPreview(jsPDFObject) {
    PDFObject.embed(jsPDFObject.output('datauristring'), pdfPreviewContainer);
    setPageTotalCount(jsPDFObject.internal.getNumberOfPages());
  }


  jsPDFAPI.saveDialog = function (options) {
    'use strict';
    options = options || {};
    showDialog(options);
    
    // it is good practice to return ref to jsPDF instance to make
    // the calls chainable.
    return this;
  };
})(jsPDF.API);
