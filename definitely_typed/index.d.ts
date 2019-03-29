// Type definitions for jsPDF 1.5.4
// Project: https://github.com/MrRio/jsPDF
// Definitions by: Amber Schühmacher <https://github.com/amberjs>
//                 Kevin Gonnord <https://github.com/lleios>
//                 Jackie Weng <https://github.com/jemerald>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'jspdf' {

    interface Annotation {
        type: 'text' | 'freetext' | 'link';
        title?: string;
        bounds: {
            x: number,
            y: number,
            w: number,
            h: number
        };
        contents: string;
        open?: boolean;
        color?: string;
        name?: string;
        top?: number;
        pageNumber?: number;
    }

    interface TextWithLinkOptions {
        pageNumber?: number;
        magFactor?: 'Fit' | 'FitH' | 'FitV' | 'XYZ';
        zoom?: number;
    }

    //jsPDF plugin:AutoPrint

    interface AutoPrintInput {
        variant: 'non-conform' | 'javascript'
    }

    //jsPDF plugn: HTML
    interface Html2CanvasOptions {
        /** Whether to parse and render the element asynchronously */
        async?: boolean;

        /** Whether to allow cross-origin images to taint the canvas */
        allowTaint?: boolean;

        /** Canvas background color, if none is specified in DOM. Set null for transparent */
        backgroundColor?: string | null;

        /** Existing canvas element to use as a base for drawing on */
        canvas?: any;

        /** Whether to use ForeignObject rendering if the browser supports it */
        foreignObjectRendering?: boolean;

        /** Predicate function which removes the matching elements from the render. */
        ignoreElements?: (element: HTMLElement) => boolean;

        /** Timeout for loading images, in milliseconds. Setting it to 0 will result in no timeout. */
        imageTimeout?: number;

        /** Whether to render each letter seperately. Necessary if letter-spacing is used. */
        letterRendering?: boolean;

        /** Whether to log events in the console. */
        logging?: boolean;

        /** Callback function which is called when the Document has been cloned for rendering, can be used to modify the contents that will be rendered without affecting the original source document. */
        onclone?: { (doc: HTMLDocument): void };

        /** Url to the proxy which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded. */
        proxy?: string;

        /** Whether to cleanup the cloned DOM elements html2canvas creates temporarily */
        removeContainer?: boolean;

        /** The scale to use for rendering. Defaults to the browsers device pixel ratio. */
        scale?: number;

        /** Use svg powered rendering where available (FF11+). */
        svgRendering?: boolean;

        /** Whether to test each image if it taints the canvas before drawing them */
        taintTest?: boolean;

        /** Whether to attempt to load cross-origin images as CORS served, before reverting back to proxy. */
        useCORS?: boolean;

        /** Define the width of the canvas in pixels. If null, renders with full width of the window. */
        width?: number;

        /** Define the heigt of the canvas in pixels. If null, renders with full height of the window. */
        height?: number;

        /** Crop canvas x-coordinate */
        x?: number;

        /** Crop canvas y-coordinate */
        y?: number;

        /** The x-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
        scrollX?: number;

        /** The y-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
        scrollY?: number;

        /** Window width to use when rendering Element, which may affect things like Media queries */
        windowWidth?: number;

        /** Window height to use when rendering Element, which may affect things like Media queries */
        windowHeight?: number;
    }

    interface HTMLWorkerProgress extends Promise<any> {
        val: number;
        n: number;
        ratio: number;
        state: any;
        stack: Function[]
    }
    interface HTMLWorker extends Promise<any> {
        from(src: HTMLElement | string, type: 'container' | 'canvas' | 'img' | 'pdf' | 'context2d'): HTMLWorker;
        progress: HTMLWorkerProgress;
        error(msg: string): void;
        save(filename:string):void;
        set(opt: HTMLOptions): HTMLWorker;
        get(key: 'string'): HTMLWorker;
        get(key: 'string', cbk: (value: string) => void): string;
    }

    interface HTMLOptionImage {
        type: 'jpeg' | 'png' | 'webp';
        quality: number;
    }

    interface HTMLOptionPageBreak {
        mode?: 'avoid-all' | 'css' | 'legacy' | ('avoid-all' | 'css' | 'legacy')[];
        before?: string;
        after?: string;
        avoid?: string;
    }

    interface HTMLOptions {
        callback?: (doc: jsPDF) => void;
        margin?: number | number[];
        filename?: string;
        enableLinks?: boolean;
        pagebreak?: HTMLOptionPageBreak;
        image?: HTMLOptionImage;
        html2canvas?: Html2CanvasOptions;
        jsPDF?: jsPDF
    }

    //jsPDF plugin: viewerPreferences

    interface ViewerPreferencesInput {
        HideToolbar?: boolean;
        HideMenubar?: boolean;
        HideWindowUI?: boolean;
        FitWindow?: boolean;
        CenterWindow?: boolean;
        DisplayDocTitle?: boolean;
        NonFullScreenPageMode?: 'UseNone' | 'UseOutlines' | 'UseThumbs' | 'UseOC';
        Direction?: 'L2R' | 'R2L';
        ViewArea?: 'MediaBox' | 'CropBox' | 'TrimBox' | 'BleedBox' | 'ArtBox';
        ViewClip?: 'MediaBox' | 'CropBox' | 'TrimBox' | 'BleedBox' | 'ArtBox';
        PrintArea?: 'MediaBox' | 'CropBox' | 'TrimBox' | 'BleedBox' | 'ArtBox';
        PrintClip?: 'MediaBox' | 'CropBox' | 'TrimBox' | 'BleedBox' | 'ArtBox';
        PrintScaling?: 'AppDefault' | 'None';
        Duplex?: 'Simplex' | 'DuplexFlipShortEdge' | 'DuplexFlipLongEdge' | 'none';
        PickTrayByPDFSize?: boolean;
        PrintPageRange?: number[][];
        NumCopies?: number;
    }

    //jsPDF plugin: Outline

    interface Outline {
        add(parent: any, title: string, options: OutlineOptions): OutlineItem;
    }
    interface OutlineItem {
        title: string,
        options: any,
        children: any[]
    }
    interface OutlineOptions {
        pageNumber: number
    }
    // jsPDF plugin: AcroForm
    interface AcroFormField {
        constructor(): AcroFormField;
        showWhenPrinted: boolean;
        x: number;
        y: number;
        width: number;
        height: number;
        fieldName: string;
        fontName: string;
        fontStyle: string;
        fontSize: number;
        maxFontSize: number;
        color: string;
        defaultValue: string;
        value: string;
        hasAnnotation: boolean;
        readOnly: boolean;
        required: boolean;
        noExport: boolean;
        textAlign: 'left' | 'center' | 'right';
    }

    interface AcroFormChoiceField extends AcroFormField {
        topIndex: number;
        getOptions(): string[];
        setOptions(value: string[]): void;
        addOption(value: string): void;
        removeOption(value: string, allEntries: boolean): void;
        combo: boolean;
        edit: boolean;
        sort: boolean;
        multiSelect: boolean;
        doNotSpellCheck: boolean;
        commitOnSelChange: boolean;
    }

    interface AcroFormListBox extends AcroFormChoiceField { }

    interface AcroFormComboBox extends AcroFormListBox { }

    interface AcroFormEditBox extends AcroFormComboBox { }

    interface AcroFormButton extends AcroFormField {
        noToggleToOff: boolean;
        radio: boolean;
        pushButton: boolean;
        radioIsUnison: boolean;
        caption: string;
        appearanceState: any;
    }

    interface AcroFormPushButton extends AcroFormButton { }

    interface AcroFormChildClass extends AcroFormField {
        Parent: any;
        optionName: string;
        caption: string;
        appearanceState: 'On' | 'Off';
    }

    interface AcroFormRadioButton extends AcroFormButton {
        setAppearance(appearance: string): void;
        createOption(name: string): AcroFormChildClass;
    }

    interface AcroFormCheckBox extends AcroFormButton {
        appearanceState: 'On' | 'Off';
    }

    interface AcroFormTextField extends AcroFormField {
        multiline: boolean;
        fileSelect: boolean;
        doNotSpellCheck: boolean;
        doNotScroll: boolean;
        comb: boolean;
        richText: boolean;
        maxLength: number;
        hasAppearanceStream: boolean;
    }

    interface AcroFormPasswordField extends AcroFormTextField { }
    // jsPDF plugin: Context2D

    interface Gradient {
        addColorStop(position: number, color: string): void;
        getColor(): string;
    }

    interface Context2d {
        autoPaging: boolean;
        fillStyle: string | Gradient;
        filter: string;
        font: string;
        globalAlpha: number;
        globalCompositeOperation: 'source-over';
        imageSmoothingEnabled: boolean;
        imageSmoothingQuality: 'low' | 'high';
        ignoreClearRect: boolean;
        lastBreak: number;
        lineCap: 'butt' | 'round' | 'square';
        lineDashOffset: number;
        lineJoin: 'bevel' | 'round' | 'miter';
        lineWidth: number;
        miterLimit: number;
        pageBreaks: number[];
        pageWrapXEnabled: boolean;
        pageWrapYEnabled: boolean;
        posX: number;
        posY: number;
        shadowBlur: number;
        shadowColor: string;
        shadowOffsetX: number;
        shadowOffsetY: number;
        strokeStyle: string | Gradient;
        textAlign: 'right' | 'end' | 'center' | 'left' | 'start';
        textBaseline: 'alphabetic' | 'bottom' | 'top' | 'hanging' | 'middle' | 'ideographic';
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise: boolean): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        beginPath(): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        clearRect(x: number, y: number, w: number, h: number): void;
        clip(): void;
        closePath(): void;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): Gradient;
        createPattern(): Gradient;
        createRadialGradient(): Gradient;
        drawImage(img: string, x: number, y: number, width: number, height: number): void;
        drawImage(img: string, sx: number, sy: number, swidth: number, sheight: number, x: number, y: number, width: number, height: number): void;
        fill(): void;
        fillRect(x: number, y: number, w: number, h: number): void;
        fillText(text: string, x: number, y: number, maxWidth?: number): void;
        lineTo(x: number, y: number): void;
        measureText(text: string): number;
        moveTo(x: number, y: number): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        rect(x: number, y: number, w: number, h: number): void;
        restore(): void;
        rotate(angle: number): void;
        save(): void;
        scale(scalewidth: number, scaleheight: number): void;
        setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        stroke(): void;
        strokeRect(x: number, y: number, w: number, h: number): void;
        strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
        translate(x: number, y: number): void;
    }

    class jsPDF {
        constructor(options?: any);
        constructor(orientation?: 'p' | 'portrait' | 'l' | 'landscape',
            unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc',
            format?: string | number[],
            compressPdf?: boolean);

        CapJoinStyles: any;
        version: string;

        addFont(postScriptName: string, id: string, fontStyle: string, encoding: 'StandardEncoding' | 'MacRomanEncoding' | 'Identity-H' | 'WinAnsiEncoding', isStandardFont?: boolean): string;
        addGState(key: any, gState: any): jsPDF;
        addPage(format?: string | number[], orientation?: 'p' | 'portrait' | 'l' | 'landscape'): jsPDF;
        beginFormObject(x: number, y: number, width: number, height: number, matrix: any): jsPDF;
        circle(x: number, y: number, r: number, style: string): jsPDF;
        clip(rule?: 'evenodd'): jsPDF;
        discardPath(): jsPDF;
        deletePage(targetPage: number): jsPDF;
        doFormObject(key: any, matrix: any): jsPDF;
        ellipse(x: number, y: number, rx: number, ry: number, style?: string): jsPDF;
        endFormObject(key: any): jsPDF;
        f2(number: number): string;
        f3(number: number): string;
        getCharSpace(): number;
        getCreationDate(type: string): Date;
        getCurrentPageInfo(): any
        getFileId(): string;
        getFillColor(): string;
        getFont(): any;
        getFontList(): any[];
        getFontSize(): number;
        getFormObject(key: any): any;
        getLineHeight(): number;
        getLineHeightFactor(): number;
        getNumberOfPages(): number;
        getPageInfo(pageNumberOneBased: number): any;
        getR2L(): boolean;
        getStyle(style: string): string;
        getTextColor(): string;
        insertPage(beforePage: number): jsPDF;
        line(x1: number, y1: number, x2: number, y2: number): any;
        lines(lines: any[], x: any, y: any, scale?: any, style?: string, closed?: boolean): jsPDF;
        movePage(targetPage: number, beforePage: number): jsPDF;
        output(type?: string, options?: any): any;
        pdfEscape(text: string, flags: any): any;
        path(lines?: any[], style?: string, patternKey?: string, patternData?: any): jsPDF;
        rect(x: number, y: number, w: number, h: number, style?: string): jsPDF;
        restoreGraphicsState(): jsPDF;
        roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string): jsPDF;
        save(filename?: string, options?: any): jsPDF;
        saveGraphicsState(): jsPDF;
        setCharSpace(charSpace: number): jsPDF;
        setCreationDate(date?: any): jsPDF;
        setCurrentTransformationMatrix(matrix: any): jsPDF;
        setDisplayMode(zoom: number | 'fullheight' | 'fullwidth' | 'fullpage' | 'original' | string, layout?: 'continuous' | 'single' | 'twoleft' | 'tworight' | 'two', pmode?: 'UseOutlines' | 'UseThumbs' | 'FullScreen'): jsPDF;
        setDocumentProperties(properties: any): jsPDF;
        setProperties(properties: any): jsPDF;
        setDrawColor(ch1: string): jsPDF;
        setDrawColor(ch1: number): jsPDF;
        setDrawColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
        setFileId(value: string): jsPDF;
        setFillColor(ch1: string): jsPDF;
        setFillColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
        setFont(fontName: string, fontStyle?: string): jsPDF;
        setFontType(fontStyle: string): jsPDF;
        setFontStyle(fontStyle: string): jsPDF;
        setFontSize(size: number): jsPDF;
        setGState(gState: any): jsPDF;
        setLineCap(style: string | number): jsPDF;
        setLineDashPattern(dashArray: number[], dashPhase: number): jsPDF;
        setLineHeightFactor(value: number): jsPDF;
        setLineJoin(style: string | number): jsPDF;
        setLineMiterLimit(length: number): jsPDF;
        setLineWidth(width: number): jsPDF;
        setPage(pageNumber: number): jsPDF;
        setR2L(value: boolean): jsPDF;
        setTextColor(ch1: string): jsPDF;
        setTextColor(ch1: number): jsPDF;
        setTextColor(ch1: number, ch2: number, ch3: number, ch4?: number): jsPDF;
        text(text: string | string[], x: number, y: number, options?: any, transform?: number | any): jsPDF;
        text(x: number, y: number, text: string | string[], flags?: any, angle?: number, align?: 'left' | 'center' | 'right'): jsPDF;
        triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string): jsPDF;
        getHorizontalCoordinateString(value: number): number;
        getVerticalCoordinateString(value: number): number;

        internal: {
            'scaleFactor': number;
            'pageSize': {
                width: number;
                getWidth: () => number;
                height: number;
                getHeight: () => number;
            };
            'pages': number[];
        };

        /**
         * jsPDF plugins below:
         *
         *  - AcroForm
         *  - AddHTML
         *  - AddImage
         *  - Annotations
         *  - AutoPrint
         *  - Canvas
         *  - Cell
         *  - Context2D
         *  - fileloading
         *  - FromHTML
         *  - html
         *  - JavaScript
         *  - split_text_to_size
         *  - SVG
         *  - total_pages
         *  - utf8
         *  - vfs
         *  - xmp_metadata
         */

        // jsPDF plugin: addHTML
        addHTML(element: any, x: number, y: number, options: any, callback: Function): jsPDF;
        addHTML(element: any, callback: Function): jsPDF;

        // jsPDF plugin: addImage
        color_spaces: any;
        decode: any;
        image_compression: any;
        getImageFileTypeByImageData(imageData: any, fallbackFormat: string): string;
        sHashCode(str: string): number;
        validateStringAsBase64(possibleBase64String: string): boolean;
        extractInfoFromBase64DataURI(dataURI: string): any[];
        extractImageFromDataUrl(dataUrl: string): any;
        supportsArrayBuffer(): boolean;
        isArrayBuffer(object: any): boolean;
        isArrayBufferView(object: any): boolean;
        binaryStringToUint8Array(binary_string: string): Uint8Array;
        arrayBufferToBinaryString(buffer: any): string;
        arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
        createImageInfo(data: any, wd: number, ht: number, cs: any, bpc: number, imageIndex: number, alias: any, f?: any, dp?: any, trns?: any, pal?: any, smask?: any): any;
        addImage(imageData: string | Uint8Array, format: string, x: number, y: number, w: number, h: number, alias?: string, compression?: any, rotation?: number): jsPDF;
        addImage(imageData: string | Uint8Array, x: number, y: number, w: number, h: number, alias?: string, compression?: any, rotation?: number): jsPDF;
        addImage(options: any): jsPDF;
        convertStringToImageData(stringData: string, throwError: boolean): any;
        getImageProperties(imageData: any): any;

        // jsPDF plugin: arabic
        processArabic(text: string): string;

        // jsPDF plugin: Annotations
        createAnnotation(options: Annotation): void;
        link(x: number, y: number, w: number, h: number, options: any): void;
        textWithLink(text: string, x: number, y: number, options: any): number;
        getTextWidth(text: string): number;

        // jsPDF plugin: AutoPrint
        autoPrint(options?: AutoPrintInput): jsPDF;

        // jsPDF plugin: AcroForm
        addField(field: AcroFormField): jsPDF;
        addButton(button: AcroFormButton): jsPDF;
        addTextField(textField: AcroFormTextField): jsPDF;
        addChoiceField(choiceField: AcroFormChoiceField): jsPDF;

        AcroForm: {
            ChoiceField(): AcroFormChoiceField,
            ListBox(): AcroFormListBox,
            ComboBox(): AcroFormComboBox,
            EditBox(): AcroFormEditBox,
            Button(): AcroFormButton,
            PushButton(): AcroFormPushButton,
            RadioButton(): AcroFormRadioButton,
            CheckBox(): AcroFormCheckBox,
            TextField(): AcroFormTextField,
            PasswordField(): AcroFormPasswordField,
            Appearance(): any
        };

        // jsPDF plugin: Canvas
        canvas: {
            pdf: jsPDF;
            width: number;
            height: number;
            getContext(type?: string): Context2d;
            style: any;
        };

        // jsPDF plugin: Cell
        setHeaderFunction(func: Function): void;
        getTextDimensions(txt: string, options?: any): any;
        cellAddPage(): void;
        cellInitialize(): void;
        cell(x: number, y: number, w: number, h: number, txt: string, ln: number, align: string): jsPDF;
        arrayMax(array: any[], comparisonFn?: () => number): number;
        table(x: number, y: number, data: any, headers: string[], config: any): jsPDF;
        calculateLineHeight(headerNames: string[], columnWidths: number[], model: any[]): number;
        setTableHeaderRow(config: any[]): void;
        printHeaderRow(lineNumber: number, new_page?: boolean): void;

        context2d: Context2d;

        //jsPDF plugin: Outline
        outline: Outline;
        // jsPDF plugin: fileloading
        loadFile(url: string): string;

        // jsPDF plugin: html
        html(src: string | HTMLElement, options?: HTMLOptions): Promise<HTMLWorker>;

        // jsPDF plugin: fromHTML
        fromHTML(HTML: string | HTMLElement, x: number, y: number, settings?: any, callback?: Function, margins?: any): jsPDF;

        // jsPDF plugin: JavaScript
        addJS(javascript: string): jsPDF;

        // jsPDF plugin: split_text_to_size
        getCharWidthsArray(text: string, options?: any): any[];
        getStringUnitWidth(text: string, options?: any): number;
        splitTextToSize(text: string, maxlen: number, options?: any): any;

        // jsPDF plugin: SVG
        addSVG(svgtext: string, x: number, y: number, w?: number, h?: number): jsPDF;
        addSvgAsImage(svg: string, x: number, y: number, w: number, h: number, alias?: string, compression?: boolean, rotation?: number): jsPDF;
        // jsPDF plugin: setlanguage
        setLanguage(langCode: 'af' | 'sq' | 'ar' | 'ar-DZ' | 'ar-BH' | 'ar-EG' | 'ar-IQ' | 'ar-JO' | 'ar-KW' | 'ar-LB' | 'ar-LY' | 'ar-MA' | 'ar-OM' | 'ar-QA' | 'ar-SA' | 'ar-SY' | 'ar-TN' | 'ar-AE' | 'ar-YE' | 'an' | 'hy' | 'as' | 'ast' | 'az' | 'eu' | 'be' | 'bn' | 'bs' | 'br' | 'bg' | 'my' | 'ca' | 'ch' | 'ce' | 'zh' | 'zh-HK' | 'zh-CN' | 'zh-SG' | 'zh-TW' | 'cv' | 'co' | 'cr' | 'hr' | 'cs' | 'da' | 'nl' | 'nl-BE' | 'en' | 'en-AU' | 'en-BZ' | 'en-CA' | 'en-IE' | 'en-JM' | 'en-NZ' | 'en-PH' | 'en-ZA' | 'en-TT' | 'en-GB' | 'en-US' | 'en-ZW' | 'eo' | 'et' | 'fo' | 'fj' | 'fi' | 'fr' | 'fr-BE' | 'fr-CA' | 'fr-FR' | 'fr-LU' | 'fr-MC' | 'fr-CH' | 'fy' | 'fur' | 'gd' | 'gd-IE' | 'gl' | 'ka' | 'de' | 'de-AT' | 'de-DE' | 'de-LI' | 'de-LU' | 'de-CH' | 'el' | 'gu' | 'ht' | 'he' | 'hi' | 'hu' | 'is' | 'id' | 'iu' | 'ga' | 'it' | 'it-CH' | 'ja' | 'kn' | 'ks' | 'kk' | 'km' | 'ky' | 'tlh' | 'ko' | 'ko-KP' | 'ko-KR' | 'la' | 'lv' | 'lt' | 'lb' | 'mk' | 'ms' | 'ml' | 'mt' | 'mi' | 'mr' | 'mo' | 'nv' | 'ng' | 'ne' | 'no' | 'nb' | 'nn' | 'oc' | 'or' | 'om' | 'fa' | 'fa-IR' | 'pl' | 'pt' | 'pt-BR' | 'pa' | 'pa-IN' | 'pa-PK' | 'qu' | 'rm' | 'ro' | 'ro-MO' | 'ru' | 'ru-MO' | 'sz' | 'sg' | 'sa' | 'sc' | 'sd' | 'si' | 'sr' | 'sk' | 'sl' | 'so' | 'sb' | 'es' | 'es-AR' | 'es-BO' | 'es-CL' | 'es-CO' | 'es-CR' | 'es-DO' | 'es-EC' | 'es-SV' | 'es-GT' | 'es-HN' | 'es-MX' | 'es-NI' | 'es-PA' | 'es-PY' | 'es-PE' | 'es-PR' | 'es-ES' | 'es-UY' | 'es-VE' | 'sx' | 'sw' | 'sv' | 'sv-FI' | 'sv-SV' | 'ta' | 'tt' | 'te' | 'th' | 'tig' | 'ts' | 'tn' | 'tr' | 'tk' | 'uk' | 'hsb' | 'ur' | 've' | 'vi' | 'vo' | 'wa' | 'cy' | 'xh' | 'ji' | 'zu'): jsPDF;

        // jsPDF plugin: total_pages
        putTotalPages(pageExpression: string): jsPDF;

        // jsPDF plugin: viewerpreferences
        viewerPreferences(options: ViewerPreferencesInput, doReset?: boolean): jsPDF
        viewerPreferences(arg: 'reset'): jsPDF

        // jsPDF plugin: vfs
        existsFileInVFS(filename: string): boolean;
        addFileToVFS(filename: string, filecontent: string): jsPDF;
        getFileFromVFS(filename: string): string;

        // jsPDF plugin: xmp_metadata
        addMetadata(metadata: string, namespaceuri?: string): jsPDF;
    }

    namespace jsPDF { }

    export = jsPDF;
}
