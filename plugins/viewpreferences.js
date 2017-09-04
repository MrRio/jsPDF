/**
 * jsPDF ViewPreferences Plugin
 * @author Aras Abbasi (github.com/arasabbasi)
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Adds the ability to set ViewPreferences
 *
 * @returns {jsPDF}
 * @name viewpreferences
 * @example
 * var doc = new jsPDF();
 * doc.text(10, 10, 'This is a test');
 * doc.viewPrefences({FitWindow : true});
 * doc.save('viewPreferences.pdf');
 */

(function (jsPDFAPI) {
	'use strict';
	
	var configuration = {
        "HideToolbar"               : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "HideMenubar"               : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "HideWindowUI"              : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "FitWindow"                 : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "CenterWindow"              : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "DisplayDocTitle"           : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.4},
        "NonFullScreenPageMode"     : {defaultValue : 'UseNone', value : 'UseNone', type: 'name', explicitSet : false, valueSet : ['UseNone', 'UseOutlines', 'UseThumbs', 'UseOC'], pdfVersion : 1.3},
        "Direction"                 : {defaultValue : 'L2R', value : 'L2R', type: 'name', explicitSet : false, valueSet : ['L2R', 'R2L'], pdfVersion : 1.3},
        "ViewArea"                  : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "ViewClip"                  : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintArea"                 : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintClip"                 : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintScaling"              : {defaultValue : 'AppDefault', value : 'AppDefault', type: 'name', explicitSet : false, valueSet : ['AppDefault', 'None'], pdfVersion : 1.6},
        "Duplex"                    : {defaultValue : 'none', value : 'none', type: 'name', explicitSet : false, valueSet : ['Simplex', 'DuplexFlipShortEdge', 'DuplexFlipLongEdge', 'none'], pdfVersion : 1.7},
        "PickTrayByPDFSize"         : {defaultValue : false, value : false, tyype: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.7},
        "PrintPageRange"            : {defaultValue : '', value : '', type: 'array', explicitSet : false, valueSet : null, pdfVersion : 1.7},
        "NumCopies"                 : {defaultValue : 1, value : 1, type: 'integer', explicitSet : false, valueSet : null, pdfVersion : 1.7}
    };

	var eventsAreEnabled = false;    
	var configurationKeys = Object.keys(configuration);
	
	var arrayContainsElement = function(array, elementName) {
		var i = array.length;
		while (i--) {
			if (array[i] == elementName) {
				return true;
			}
		}
		return false;
	}
	
	var resetConfiguration = function () {
		configurationKeys.forEach(
		function (method) {
			configuration[method].value = configuration[method].defaultValue;
			configuration[method].explicitSet = false;
			}
		);
	};	
	
	jsPDFAPI.viewPreferences = function (options, doReset){
		var options = options || {};
		var doReset = doReset || false;
		
		if (options === "reset" || doReset === true) {
			return resetConfiguration();
		}
		
		if (typeof options === "object"){
			for (var elem in options) {
				if (arrayContainsElement(configurationKeys, elem)) {
					setter(elem, options[elem]);
				}
			}
		}
		
		if (eventsAreEnabled === false) {
			this.internal.events.subscribe("putCatalog", function () {
				if (jsPDFAPI.viewPreferences.__generateDictionary().length !== 5) {
					this.internal.write("/ViewerPreferences" + jsPDFAPI.viewPreferences.__generateDictionary());
				}
			});
			eventsAreEnabled = true;
		}
	};
	
	jsPDFAPI.viewPreferences.__generateDictionary = function () {
      var resultingDictionary = ['<<'];
      for (var vPref in configuration) {
        if (configuration[vPref].explicitSet === true) {
          resultingDictionary.push('/' + vPref + ' ' + configuration[vPref].value);
        }
      }
      resultingDictionary.push('>>');
      return resultingDictionary.join("\n");
    };
    	
    function setter(method, value) {
      if (typeof value === "undefined") {
        return configuration[method].value;
      }
      if (configuration[method].type === "boolean" && typeof value === "boolean") {
        configuration[method].value = value; 
      } else if (configuration[method].type === "name" && configuration[method].valueSet.contains(value)) {
        configuration[method].value = value; 
      } else if (configuration[method].type === "integer" && Number.isInteger(value)) {
        configuration[method].value = value; 
      } else if (configuration[method].type === "array" && (value.length % 2 === 0) && !value.some(isNaN)) {
        configuration[method].value = value; 
      } else {
        configuration[method].value = configuration[method].defaultValue; 
      }

      configuration[method].explicitSet = true;

      return configuration[method].value;
    };

})(jsPDF.API);
