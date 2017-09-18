(function (jsPDFAPI) {
    'use strict';

    if (jsPDF.FunctionsPool === undefined) {
        jsPDF.FunctionsPool = {};
    }
    if (jsPDF.FunctionsPool.text === undefined) {
        jsPDF.FunctionsPool.text = {
            preProcess: [],
            process: [],
            postProcess: []
        };
    }

    /**
    Returns a widths of string in a given font, if the font size is set as 1 point.

    In other words, this is "proportional" value. For 1 unit of font size, the length
    of the string will be that much.

    Multiply by font size to get actual width in *points*
    Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

    @public
    @function
    @param
    @returns {Type}
    */
    var getStringUnitWidth = function(text, options) {
        var result = 0;
        if (typeof TTFFont === "function" && options.font.metadata instanceof TTFFont === true) {
            result = options.font.metadata.widthOfString(text, options.fontSize, options.charSpace);
        } else {
            result = getArraySum(getCharWidthsArray(text, options)) * options.fontSize;
        }
        return result;
    };

    /**
    Returns an array of length matching length of the 'word' string, with each
    cell ocupied by the width of the char in that position.

    @function
    @param word {String}
    @param widths {Object}
    @param kerning {Object}
    @returns {Array}
    */
    function getCharWidthsArray(text, options) {
        options = options || {};

        var widths = options.widths ? options.widths : options.font.metadata.Unicode.widths;
        var widthsFractionOf = widths.fof ? widths.fof : 1;
        var kerning = options.kerning ? options.kerning : options.font.metadata.Unicode.kerning;
        var kerningFractionOf = kerning.fof ? kerning.fof : 1;

        var i;
        var l;
        var char_code;
        var prior_char_code = 0; //for kerning
        var default_char_width = widths[0] || widthsFractionOf;
        var output = [];

        for (i = 0, l = text.length; i < l; i++) {
            char_code = text.charCodeAt(i)
            output.push(
                ( widths[char_code] || default_char_width ) / widthsFractionOf +
                ( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
            );
            prior_char_code = char_code;
        }

        return output
    }

    var getArraySum = function(array) {
        var i = array.length;
        var output = 0;
        
        while(i) {
            ;i--;
            output += array[i];
        }
        
        return output;
    }

    var backwardsCompatibilityFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var tmp;
        var mutex = args.mutex || {};

        var flags = args.arguments[3];
        var angle = args.arguments[4];
        var align = args.arguments[5];

        //Pre-August-2012 the order of arguments was function(x, y, text, flags)
        //in effort to make all calls have similar signature like
        //function(data, coordinates... , miscellaneous)
        //this method had its args flipped.
        //code below allows backward compatibility with old arg order.
        if (typeof text === 'number') {
            tmp = y;
            y = x;
            x = text;
            text = tmp;
        }

        if (typeof flags !== "object" || flags === null) {
            if (typeof angle === 'string') {
                align = angle;
                angle = null;
            }
            if (typeof flags === 'string') {
                align = flags;
                flags = null;
            }
            if (typeof flags === 'number') {
                angle = flags;
                flags = null;
            }
            options = {flags: flags, angle: angle, align: align};
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }

    //always in the first place
    jsPDF.FunctionsPool.text.preProcess.unshift(
        backwardsCompatibilityFunction
    );

    var escapeFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};
        var pdfEscape = mutex.pdfEscape;

        function ESC(s) {
          s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
          return pdfEscape(s, {});
        }

        if (typeof text === 'string') {
        	text = ESC(text);
        }
        if (Object.prototype.toString.call(text) === '[object Array]') {
            //we don't want to destroy original text array, so cloning it
            var sa = text.concat();
            var da = [];
            var len = sa.length;
            var curDa;
            //we do array.join('text that must not be PDFescaped")
            //thus, pdfEscape each component separately
            while (len--) {
                curDa = sa.shift();
                if (typeof curDa === "string") {
                    da.push(ESC(curDa));
                } else {
                    da.push([ESC(curDa[0]), curDa[1], curDa[2]]);
                }
            }
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }

    jsPDF.FunctionsPool.text.preProcess.push(
        escapeFunction
    );

    var multilineFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};
        
        var maxWidth = options.maxWidth || 0;
        var algorythm = options.maxWidthAlgorythm || "first-fit";
        var tmpText;

        var activeFontSize = mutex.activeFontSize;
        var leading = mutex.activeFontSize * mutex.lineHeightProportion;
        var activeFont = mutex.fonts[mutex.activeFontKey];
        var k = mutex.k;
        var charSpace = options.charSpace || 1;

        //If there are any newlines in text, we assume
        //the user wanted to print multiple lines, so break the
        //text up into an array. If the text is already an array,
        //we assume the user knows what they are doing.
        //Convert text into an array anyway to simplify
        //later code.

        if (typeof text === 'string') {
            if (text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            } else {
                text = [text];
            }
        }

        var splitByMaxWidth = function (value, maxWidth) {
            var i = 0;
            var lastBreak = 0;
            var currentWidth = 0;
            var resultingChunks = [];
            var widthOfEachWord = [];
            var currentChunk = [];

            var listOfWords = [];
            var result = [];

            listOfWords = value.split(/ /g);

            var widthOfSpace = getStringUnitWidth(" ", {font: activeFont, charSpace: charSpace, fontSize: activeFontSize}) / k;
            for (i = 0; i < listOfWords.length; i += 1) {
                widthOfEachWord.push(getStringUnitWidth(listOfWords[i], {font: activeFont, charSpace: charSpace, fontSize: activeFontSize}) / k);
            }
            for (i = 0; i < listOfWords.length; i += 1) {
                currentChunk = widthOfEachWord.slice(lastBreak, i);
                currentWidth = getArraySum(currentChunk) + widthOfSpace * (currentChunk.length - 1);
                if (currentWidth >= maxWidth) {
                    resultingChunks.push(listOfWords.slice(lastBreak, (((i !== 0) ? i - 1 : 0)) ).join(" "));
                    lastBreak = (((i !== 0) ? i - 1: 0));
                    i -= 1;
                } else if (i === (widthOfEachWord.length - 1)) {
                    resultingChunks.push(listOfWords.slice(lastBreak, widthOfEachWord.length).join(" "));
                }
            }
            result = [];
            for (i = 0; i < resultingChunks.length; i += 1) {
                result = result.concat(resultingChunks[i])
            }
            return result;
        }
        var firstFitMethod = function(value, maxWidth) {
            var j = 0;
            var tmpText = [];
            for (j = 0; j < value.length; j += 1){
                tmpText = tmpText.concat(splitByMaxWidth(value[j], maxWidth));
            }
            return tmpText;
        }
        if (maxWidth > 0) {
            switch (algorythm) {
                case "first-fit":
                default:
                    text = firstFitMethod(text, maxWidth);
                    break;
            }
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }

    jsPDF.FunctionsPool.text.preProcess.push(
        multilineFunction
    );

    var angleFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};

        var angle = options.angle;
        var k = mutex.k;
        var curY = (mutex.pageHeight - y) * k;
        var transformationMatrix = [];
        
        if (angle) {
            angle *= (Math.PI / 180);
            var c = Math.cos(angle),
            s = Math.sin(angle);
            var f2 = function(number) {
                return number.toFixed(2);
            }
            transformationMatrix = [f2(c), f2(s), f2(s * -1), f2(c)];
            mutex.transformationMatrix = transformationMatrix;
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }
    
    jsPDF.FunctionsPool.text.process.push(
        angleFunction
    );
    
    var charSpaceFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};
        var charSpace = options.charSpace;
        
        if (charSpace !== undefined) {
            mutex.charSpace = {
                renderer: function () {
                    return charSpace +" Tc\n";
                }
            };
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }
    
    jsPDF.FunctionsPool.text.process.push(
        charSpaceFunction
    );
        
        
    var langFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};
        var lang = options.lang;
        
        if (lang) {
            mutex.lang = {
                renderer: function () {
                    return "/Lang (" + lang +")\n";
                }
            };
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        }
    }
    
    jsPDF.FunctionsPool.text.process.push(
        langFunction
    );
        
    var renderingModeFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};

        var renderingMode = -1;
        var tmpRenderingMode = -1;
        var parmRenderingMode = options.renderingMode || options.stroke;
        var pageContext = mutex.scope.internal.getCurrentPageInfo().pageContext;

        switch (parmRenderingMode) {
            case 0:
            case false:
            case 'fill':
                tmpRenderingMode = 0;
                break;
            case 1:
            case true:
            case 'stroke':
                tmpRenderingMode = 1;
                break;
            case 2:
            case 'fillThenStroke':
                tmpRenderingMode = 2;
                break;
            case 3:
            case 'invisible':
                tmpRenderingMode = 3;
                break;
            case 4:
            case 'fillAndAddForClipping':
                tmpRenderingMode = 4;
                break;
            case 5:
            case 'strokeAndAddPathForClipping':
                tmpRenderingMode = 5;
                break;
            case 6:
            case 'fillThenStrokeAndAddToPathForClipping':
                tmpRenderingMode = 6;
                break;
            case 7:
            case 'addToPathForClipping':
                tmpRenderingMode = 7;
                break;
            }
            
            var usedRenderingMode = pageContext.usedRenderingMode || -1;

            //if the coder wrote it explicitly to use a specific 
            //renderingMode, then use it
            if (tmpRenderingMode !== -1) {
                mutex.renderingMode = {
                    renderer: function () {
                        return tmpRenderingMode + " Tr\n"
                    }
                };
            //otherwise check if we used the rendering Mode already
            //if so then set the rendering Mode...
            } else if (usedRenderingMode !== -1) {
                mutex.renderingMode = {
                    renderer: function () {
                        return "0 Tr\n";
                    }
                };
            }

            if (tmpRenderingMode !== -1) {
                pageContext.usedRenderingMode = tmpRenderingMode;
            }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        };
    }

    jsPDF.FunctionsPool.text.process.push(
        renderingModeFunction
    );
    var alignFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};

        var align = options.align || 'left';
        var activeFontSize = mutex.activeFontSize;
        var leading = mutex.activeFontSize * mutex.lineHeightProportion;
        var pageHeight = mutex.pageHeight;
        var pageWidth = mutex.pageWidth;
        var lineWidth = mutex.lineWidth;
        var activeFont = mutex.fonts[mutex.activeFontKey];
        var k = mutex.k;
        var charSpace = options.charSpace || 1;
        var widths;
        var maxWidth = options.maxWidth || 0;
        
        if (typeof text === "string") {
            text = [text];
        }
        var lineWidths;
        var flags = {};

        if (Object.prototype.toString.call(text) === '[object Array]') {
                //we don't want to destroy original text array, so cloning it
                var sa = text.concat();
                var da = [];
                var len = sa.length;
                var curDa;
                //we do array.join('text that must not be PDFescaped")
                //thus, pdfEscape each component separately
                while (len--) {
                    curDa = sa.shift();
                    if (typeof curDa === "string") {
                        da.push(curDa);
                    } else {
                        da.push([curDa[0], curDa[1], curDa[2]]);
                    }
                }
                var left = 0;
                var newY;
                var maxLineLength;
                var lineWidths;
                if (align !== "left") {
                    lineWidths = text.map(function(v) {
                        return getStringUnitWidth(v, {font: activeFont, charSpace: charSpace, fontSize: activeFontSize}) / k;
                    });
                }
                var maxLineLength = Math.max.apply(Math, lineWidths);
                mutex.maxLineLength = maxLineLength;
                //The first line uses the "main" Td setting,
                //and the subsequent lines are offset by the
                //previous line's x coordinate.
                var prevWidth = 0;
                var delta;
                var newX;
                if (align === "right") {
                    //The passed in x coordinate defines the
                    //rightmost point of the text.
                    left = x - maxLineLength;
                    x -= lineWidths[0];
                    text = [];
                    for (var i = 0, len = da.length; i < len; i++) {
                        delta = maxLineLength - lineWidths[i];
                        if (i === 0) {
                            newX = x *k;
                            newY = (pageHeight - y)*k;
                        } else {
                            newX = (prevWidth - lineWidths[i]) * k;
                            newY = -leading;
                        }
                        text.push([da[i], newX, newY]);
                        prevWidth = lineWidths[i];
                    }
                }
                if (align === "center") {
                    //The passed in x coordinate defines
                    //the center point.
                    left = x - maxLineLength / 2;
                    x -= lineWidths[0] / 2;
                    text = [];
                    for (var i = 0, len = da.length; i < len; i++) {
                        delta = (maxLineLength - lineWidths[i]) / 2;
                        if (i === 0) {
                            newX = x*k;
                            newY = (pageHeight - y)*k;
                        } else {
                            newX = (prevWidth - lineWidths[i]) / 2 * k;
                            newY = -leading;
                        }
                        text.push([da[i], newX, newY]);
                        prevWidth = lineWidths[i];
                    }
                }
                if (align === "left") {
                    text = [];
                    for (var i = 0, len = da.length; i < len; i++) {
                        newY = (i === 0) ? (pageHeight - y)*k : -leading;
                        newX = (i === 0) ? x*k : 0;
                        text.push([da[i], newX, newY]);
                    }
                }
                if (align === "justify") {
                    text = [];
                    mutex.wordSpacingPerLine = [];
                    var maxWidth = (maxWidth !== 0) ? maxWidth : pageWidth;
                    
                    for (var i = 0, len = da.length; i < len; i++) {
                        newY = (i === 0) ? (pageHeight - y)*k : -leading;
                        newX = (i === 0) ? x*k : 0;
                    	if (i < (len - 1)) {
                    		mutex.wordSpacingPerLine.push(((maxWidth - lineWidths[i]) / (da[i].split(" ").length - 1) * k).toFixed(2));
                    	}
                        text.push([da[i], newX, newY]);
                    }
                }
            }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        };
    }

    jsPDF.FunctionsPool.text.process.push(
        alignFunction
    );

    var generateResultFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};

        var k = mutex.k;

        if (typeof text === 'string') {
            text = [text]
        } 
        
        if (Object.prototype.toString.call(text) === '[object Array]') {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
            curDa = sa.shift();
            if (typeof curDa === "string") {
                da.push(curDa, options);
            } else {
                da.push([curDa[0], curDa[1], curDa[2]]);
            }
        }

            text = [];
            var variant = 0;
            var len = da.length;
            var posX;
            var posY;
            var content;
            var xtra = "";

            for (var i = 0; i < len; i++) {
                if ((Object.prototype.toString.call(da[i]) !== '[object Array]')) {
                    posX = (parseFloat(x)).toFixed(2);
                    posY = (parseFloat(y)).toFixed(2);
                    content = (((mutex.isHex) ? "<" : "(")) + da[i] + ((mutex.isHex) ? ">" : ")");
                    
                } else if (Object.prototype.toString.call(da[i]) === '[object Array]') {
                    posX = (parseFloat(da[i][1])).toFixed(2);
                    posY = (parseFloat(da[i][2])).toFixed(2);
                    content = (((mutex.isHex) ? "<" : "(")) + da[i][0] + ((mutex.isHex) ? ">" : ")");
                    variant = 1;
                }
                if (mutex.hasOwnProperty("wordSpacingPerLine") && mutex.wordSpacingPerLine[i] !== undefined) {
                    xtra = mutex.wordSpacingPerLine[i] + " Tw\n";
                }
                //TODO: Kind of a hack?
                if (mutex.hasOwnProperty("transformationMatrix") && i === 0) {
                    text.push(mutex.transformationMatrix.join(" ") + " " + posX + " " + posY + " Tm\n" + content);
                } else {
                    text.push(xtra + posX + " " + posY + " Td\n" + content);
                }
            }
            if (variant === 0) {
                text = text.join(" Tj\nT* ");
            } else {
                text = text.join(" Tj\n");
            }

            text += " Tj\n";
            mutex.processed = true;
            
        } else {
            throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        };
    }

    jsPDF.FunctionsPool.text.postProcess.push(
        generateResultFunction
    );
})(jsPDF.API);
