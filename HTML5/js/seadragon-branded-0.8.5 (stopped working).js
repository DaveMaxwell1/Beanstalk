/**
 * Seadragon Ajax 0.8.5 (build 20121 on 2010-05-19)
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * For more information, visit: http://livelabs.com/seadragon-ajax/
 */
if (!window.Seadragon) {
    window.Seadragon = {};
}
(function () {
    if (Seadragon.Config) {
        return;
    }
    Seadragon.Config = {
        debugMode: false,
        animationTime: 1.5,
        blendTime: 0.5,
        alwaysBlend: false,
        autoHideControls: true,
        immediateRender: false,
        wrapHorizontal: false,
        wrapVertical: false,
        wrapOverlays: false,
        minZoomDimension: null,
        //minZoomImageRatio: 0.8,
		minZoomImageRatio: 1,
        maxZoomPixelRatio: 2,
        visibilityRatio: 0.5,
        springStiffness: 5.0,
        imageLoaderLimit: 2,
        clickTimeThreshold: 200,
        clickDistThreshold: 5,
        zoomPerClick: 2.0,
        zoomPerScroll: 1.2,
        zoomPerSecond: 2.0,
        proxyUrl: null,
        imagePath: "img/"
    };
})();
(function () {
    if (Seadragon.Strings) {
        return;
    }
    Seadragon.Strings = {
        Errors: {
            Failure: "Sorry, but Seadragon Ajax can't run on your browser!\n" + "Please try using IE 8 or Firefox 3.\n",
            Dzc: "Sorry, we don't support Deep Zoom Collections!",
            Dzi: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
            Xml: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
            Empty: "You asked us to open nothing, so we did just that.",
            ImageFormat: "Sorry, we don't support {0}-based Deep Zoom Images.",
            Security: "It looks like a security restriction stopped us from " + "loading this Deep Zoom Image.",
            Status: "This space unintentionally left blank ({0} {1}).",
            Unknown: "Whoops, something inexplicably went wrong. Sorry!"
        },
        Messages: {
            Loading: "Loading..."
        },
        Tooltips: {
            FullPage: "Toggle full page",
            Home: "Go home",
            ZoomIn: "Zoom in (you can also use your mouse's scroll wheel)",
            ZoomOut: "Zoom out (you can also use your mouse's scroll wheel)"
        }
    };
    Seadragon.Strings.getString = function (prop) {
        var props = prop.split('.');
        var string = Seadragon.Strings;
        for (var i = 0; i < props.length; i++) {
            string = string[props[i]] || {};
        }
        if (typeof (string) != "string") {
            string = "";
        }
        var args = arguments;
        return string.replace(/\{\d+\}/g, function (capture) {
            var i = parseInt(capture.match(/\d+/)) + 1;
            return i < args.length ? args[i] : "";
        });
    };
    Seadragon.Strings.setString = function (prop, value) {
        var props = prop.split('.');
        var container = Seadragon.Strings;
        for (var i = 0; i < props.length - 1; i++) {
            if (!container[props[i]]) {
                container[props[i]] = {};
            }
            container = container[props[i]];
        }
        container[props[i]] = value;
    };
})();
Seadragon.Debug = function () {
    this.log = function (msg, important) {
        var console = window.console || {};
        var debug = Seadragon.Config.debugMode;
        if (debug && console.log) {
            console.log(msg);
        } else if (debug && important) {
            alert(msg);
        }
    };
    this.error = function (msg, e) {
        var console = window.console || {};
        var debug = Seadragon.Config.debugMode;
        if (debug && console.error) {
            console.error(msg);
        } else if (debug) {
            alert(msg);
        }
        if (debug) {
            throw e || new Error(msg);
        }
    };
    this.fail = function (msg) {
        alert(Seadragon.Strings.getString("Errors.Failure"));
        throw new Error(msg);
    };
};
Seadragon.Debug = new Seadragon.Debug();
Seadragon.Profiler = function () {
    var self = this;
    var midUpdate = false;
    var numUpdates = 0;
    var lastBeginTime = null;
    var lastEndTime = null;
    var minUpdateTime = Infinity;
    var avgUpdateTime = 0;
    var maxUpdateTime = 0;
    var minIdleTime = Infinity;
    var avgIdleTime = 0;
    var maxIdleTime = 0;
    this.getAvgUpdateTime = function () {
        return avgUpdateTime;
    };
    this.getMinUpdateTime = function () {
        return minUpdateTime;
    };
    this.getMaxUpdateTime = function () {
        return maxUpdateTime;
    };
    this.getAvgIdleTime = function () {
        return avgIdleTime;
    };
    this.getMinIdleTime = function () {
        return minIdleTime;
    };
    this.getMaxIdleTime = function () {
        return maxIdleTime;
    };
    this.isMidUpdate = function () {
        return midUpdate;
    };
    this.getNumUpdates = function () {
        return numUpdates;
    };
    this.beginUpdate = function () {
        if (midUpdate) {
            self.endUpdate();
        }
        midUpdate = true;
        lastBeginTime = new Date().getTime();
        if (numUpdates < 1) {
            return;
        }
        var time = lastBeginTime - lastEndTime;
        avgIdleTime = (avgIdleTime * (numUpdates - 1) + time) / numUpdates;
        if (time < minIdleTime) {
            minIdleTime = time;
        }
        if (time > maxIdleTime) {
            maxIdleTime = time;
        }
    };
    this.endUpdate = function () {
        if (!midUpdate) {
            return;
        }
        lastEndTime = new Date().getTime();
        midUpdate = false;
        var time = lastEndTime - lastBeginTime;
        numUpdates++;
        avgUpdateTime = (avgUpdateTime * (numUpdates - 1) + time) / numUpdates;
        if (time < minUpdateTime) {
            minUpdateTime = time;
        }
        if (time > maxUpdateTime) {
            maxUpdateTime = time;
        }
    };
    this.clearProfile = function () {
        midUpdate = false;
        numUpdates = 0;
        lastBeginTime = null;
        lastEndTime = null;
        minUpdateTime = Infinity;
        avgUpdateTime = 0;
        maxUpdateTime = 0;
        minIdleTime = Infinity;
        avgIdleTime = 0;
        maxIdleTime = 0;
    };
};
(function () {
    Seadragon.Point = function (x, y) {
        this.x = typeof (x) == "number" ? x : 0;
        this.y = typeof (y) == "number" ? y : 0;
    };
    var SDPointPrototype = Seadragon.Point.prototype;
    SDPointPrototype.plus = function (point) {
        return new Seadragon.Point(this.x + point.x, this.y + point.y);
    };
    SDPointPrototype.minus = function (point) {
        return new Seadragon.Point(this.x - point.x, this.y - point.y);
    };
    SDPointPrototype.times = function (factor) {
        return new Seadragon.Point(this.x * factor, this.y * factor);
    };
    SDPointPrototype.divide = function (factor) {
        return new Seadragon.Point(this.x / factor, this.y / factor);
    };
    SDPointPrototype.negate = function () {
        return new Seadragon.Point(-this.x, -this.y);
    };
    SDPointPrototype.distanceTo = function (point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) +
            Math.pow(this.y - point.y, 2));
    };
    SDPointPrototype.apply = function (func) {
        return new Seadragon.Point(func(this.x), func(this.y));
    };
    SDPointPrototype.equals = function (point) {
        return (point instanceof Seadragon.Point) && (this.x === point.x) && (this.y === point.y);
    };
    SDPointPrototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
})();
(function () {
    Seadragon.Rect = function (x, y, width, height) {
        this.x = typeof (x) == "number" ? x : 0;
        this.y = typeof (y) == "number" ? y : 0;
        this.width = typeof (width) == "number" ? width : 0;
        this.height = typeof (height) == "number" ? height : 0;
    };
    var SDRectPrototype = Seadragon.Rect.prototype;
    SDRectPrototype.getAspectRatio = function () {
        return this.width / this.height;
    };
    SDRectPrototype.getTopLeft = function () {
        return new Seadragon.Point(this.x, this.y);
    };
    SDRectPrototype.getBottomRight = function () {
        return new Seadragon.Point(this.x + this.width, this.y + this.height);
    };
    SDRectPrototype.getCenter = function () {
        return new Seadragon.Point(this.x + this.width / 2.0, this.y + this.height / 2.0);
    };
    SDRectPrototype.getSize = function () {
        return new Seadragon.Point(this.width, this.height);
    };
    SDRectPrototype.equals = function (other) {
        return (other instanceof Seadragon.Rect) && (this.x === other.x) && (this.y === other.y) && (this.width === other.width) && (this.height === other.height);
    };
    SDRectPrototype.toString = function () {
        return "[" + this.x + "," + this.y + "," + this.width + "x" +
            this.height + "]";
    };
})();
Seadragon.Spring = function (initialValue) {
    var currentValue = typeof (initialValue) == "number" ? initialValue : 0;
    var startValue = currentValue;
    var targetValue = currentValue;
    var currentTime = new Date().getTime();
    var startTime = currentTime;
    var targetTime = currentTime;

    function transform(x) {
        var s = Seadragon.Config.springStiffness;
        return (1.0 - Math.exp(-x * s)) / (1.0 - Math.exp(-s));
    }
    this.getCurrent = function () {
        return currentValue;
    };
    this.getTarget = function () {
        return targetValue;
    };
    this.resetTo = function (target) {
        targetValue = target;
        targetTime = currentTime;
        startValue = targetValue;
        startTime = targetTime;
    };
    this.springTo = function (target) {
        startValue = currentValue;
        startTime = currentTime;
        targetValue = target;
        targetTime = startTime + 1000 * Seadragon.Config.animationTime;
    };
    this.shiftBy = function (delta) {
        startValue += delta;
        targetValue += delta;
    };
    this.update = function () {
        currentTime = new Date().getTime();
        currentValue = (currentTime >= targetTime) ? targetValue : startValue + (targetValue - startValue) * transform((currentTime - startTime) / (targetTime - startTime));
    };
};
Seadragon.Utils = function () {
    var Browser = {
        UNKNOWN: 0,
        IE: 1,
        FIREFOX: 2,
        SAFARI: 3,
        CHROME: 4,
        OPERA: 5
    };
    Seadragon.Browser = Browser;
    var self = this;
    var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
    var fileFormats = {
        "bmp": false,
        "jpeg": true,
        "jpg": true,
        "png": true,
        "tif": false,
        "wdp": false
    };
    var browser = Browser.UNKNOWN;
    var browserVersion = 0;
    var badAlphaBrowser = false;
    var urlParams = {};
    (function () {
        var app = navigator.appName;
        var ver = navigator.appVersion;
        var ua = navigator.userAgent;
        if (app == "Microsoft Internet Explorer" && !! window.attachEvent && !! window.ActiveXObject) {
            var ieOffset = ua.indexOf("MSIE");
            browser = Browser.IE;
            browserVersion = parseFloat(ua.substring(ieOffset + 5, ua.indexOf(";", ieOffset)));
        } else if (app == "Netscape" && !! window.addEventListener) {
            var ffOffset = ua.indexOf("Firefox");
            var saOffset = ua.indexOf("Safari");
            var chOffset = ua.indexOf("Chrome");
            if (ffOffset >= 0) {
                browser = Browser.FIREFOX;
                browserVersion = parseFloat(ua.substring(ffOffset + 8));
            } else if (saOffset >= 0) {
                var slash = ua.substring(0, saOffset).lastIndexOf("/");
                browser = (chOffset >= 0) ? Browser.CHROME : Browser.SAFARI;
                browserVersion = parseFloat(ua.substring(slash + 1, saOffset));
            }
        } else if (app == "Opera" && !! window.opera && !! window.attachEvent) {
            browser = Browser.OPERA;
            browserVersion = parseFloat(ver);
        }
        var query = window.location.search.substring(1);
        var parts = query.split('&');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var sep = part.indexOf('=');
            if (sep > 0) {
                urlParams[part.substring(0, sep)] = decodeURIComponent(part.substring(sep + 1));
            }
        }
        badAlphaBrowser = (browser == Browser.IE || (browser == Browser.CHROME && browserVersion < 2));
    })();

    function getOffsetParent(elmt, isFixed) {
        if (isFixed && elmt != document.body) {
            return document.body;
        } else {
            return elmt.offsetParent;
        }
    }
    this.getBrowser = function () {
        return browser;
    };
    this.getBrowserVersion = function () {
        return browserVersion;
    };
    this.getElement = function (elmt) {
        if (typeof (elmt) == "string") {
            elmt = document.getElementById(elmt);
        }
        return elmt;
    };
    this.getElementPosition = function (elmt) {
        var elmt = self.getElement(elmt);
        var result = new Seadragon.Point();
        var isFixed = self.getElementStyle(elmt).position == "fixed";
        var offsetParent = getOffsetParent(elmt, isFixed);
        while (offsetParent) {
            result.x += elmt.offsetLeft;
            result.y += elmt.offsetTop;
            if (isFixed) {
                result = result.plus(self.getPageScroll());
            }
            elmt = offsetParent;
            isFixed = self.getElementStyle(elmt).position == "fixed";
            offsetParent = getOffsetParent(elmt, isFixed);
        }
        return result;
    };
    this.getElementSize = function (elmt) {
        var elmt = self.getElement(elmt);
        return new Seadragon.Point(elmt.clientWidth, elmt.clientHeight);
    };
    this.getElementStyle = function (elmt) {
        var elmt = self.getElement(elmt);
        if (elmt.currentStyle) {
            return elmt.currentStyle;
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(elmt, "");
        } else {
            Seadragon.Debug.fail("Unknown element style, no known technique.");
        }
    };
    this.getEvent = function (event) {
        return event ? event : window.event;
    };
    this.getMousePosition = function (event) {
        var event = self.getEvent(event);
        var result = new Seadragon.Point();
        if (event.type == "DOMMouseScroll" && browser == Browser.FIREFOX && browserVersion < 3) {
            result.x = event.screenX;
            result.y = event.screenY;
        } else if (typeof (event.pageX) == "number") {
            result.x = event.pageX;
            result.y = event.pageY;
        } else if (typeof (event.clientX) == "number") {
            result.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            result.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
            Seadragon.Debug.fail("Unknown event mouse position, no known technique.");
        }
        return result;
    };
    this.getMouseScroll = function (event) {
        var event = self.getEvent(event);
        var delta = 0;
        if (typeof (event.wheelDelta) == "number") {
            delta = event.wheelDelta;
        } else if (typeof (event.detail) == "number") {
            delta = event.detail * -1;
        } else {
            Seadragon.Debug.fail("Unknown event mouse scroll, no known technique.");
        }
        return delta ? delta / Math.abs(delta) : 0;
    };
    this.getPageScroll = function () {
        var result = new Seadragon.Point();
        var docElmt = document.documentElement || {};
        var body = document.body || {};
        if (typeof (window.pageXOffset) == "number") {
            result.x = window.pageXOffset;
            result.y = window.pageYOffset;
        } else if (body.scrollLeft || body.scrollTop) {
            result.x = body.scrollLeft;
            result.y = body.scrollTop;
        } else if (docElmt.scrollLeft || docElmt.scrollTop) {
            result.x = docElmt.scrollLeft;
            result.y = docElmt.scrollTop;
        }
        return result;
    };
    this.getWindowSize = function () {
        var result = new Seadragon.Point();
        var docElmt = document.documentElement || {};
        var body = document.body || {};
        if (typeof (window.innerWidth) == 'number') {
            result.x = window.innerWidth;
            result.y = window.innerHeight;
        } else if (docElmt.clientWidth || docElmt.clientHeight) {
            result.x = docElmt.clientWidth;
            result.y = docElmt.clientHeight;
        } else if (body.clientWidth || body.clientHeight) {
            result.x = body.clientWidth;
            result.y = body.clientHeight;
        } else {
            Seadragon.Debug.fail("Unknown window size, no known technique.");
        }
        return result;
    };
    this.imageFormatSupported = function (ext) {
        var ext = ext ? ext : "";
        return !!fileFormats[ext.toLowerCase()];
    };
    this.makeCenteredNode = function (elmt) {
        var elmt = Seadragon.Utils.getElement(elmt);
        var div = self.makeNeutralElement("div");
        var html = [];
        html.push('<div style="display:table; height:100%; width:100%;');
        html.push('border:none; margin:0px; padding:0px;');
        html.push('#position:relative; overflow:hidden; text-align:left;">');
        html.push('<div style="#position:absolute; #top:50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;');
        html.push('display:table-cell; vertical-align:middle;">');
        html.push('<div style="#position:relative; #top:-50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;');
        html.push('text-align:center;"></div></div></div>');
        div.innerHTML = html.join('');
        div = div.firstChild;
        var innerDiv = div;
        var innerDivs = div.getElementsByTagName("div");
        while (innerDivs.length > 0) {
            innerDiv = innerDivs[0];
            innerDivs = innerDiv.getElementsByTagName("div");
        }
        innerDiv.appendChild(elmt);
        return div;
    };
    this.makeNeutralElement = function (tagName) {
        var elmt = document.createElement(tagName);
        var style = elmt.style;
        style.background = "transparent none";
        style.border = "none";
        style.margin = "0px";
        style.padding = "0px";
        style.position = "static";
        return elmt;
    };
    this.makeTransparentImage = function (src) {
        var img = self.makeNeutralElement("img");
        var elmt = null;
        if (browser == Browser.IE && browserVersion < 7) {
            elmt = self.makeNeutralElement("span");
            elmt.style.display = "inline-block";
            img.onload = function () {
                elmt.style.width = elmt.style.width || img.width + "px";
                elmt.style.height = elmt.style.height || img.height + "px";
                img.onload = null;
                img = null;
            };
            img.src = src;
            elmt.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                src + "', sizingMethod='scale')";
        } else {
            elmt = img;
            elmt.src = src;
        }
        return elmt;
    };
    this.setElementOpacity = function (elmt, opacity, usesAlpha) {
        var elmt = self.getElement(elmt);
        if (usesAlpha && badAlphaBrowser) {
            opacity = Math.round(opacity);
        }
        if (opacity < 1) {
            elmt.style.opacity = opacity;
        } else {
            elmt.style.opacity = "";
        }
        if (opacity == 1) {
            var prevFilter = elmt.style.filter || "";
            elmt.style.filter = prevFilter.replace(/alpha\(.*?\)/g, "");
            return;
        }
        var ieOpacity = Math.round(100 * opacity);
        var ieFilter = " alpha(opacity=" + ieOpacity + ") ";
        try {
            if (elmt.filters && elmt.filters.alpha) {
                elmt.filters.alpha.opacity = ieOpacity;
            } else {
                elmt.style.filter += ieFilter;
            }
        } catch (e) {
            elmt.style.filter += ieFilter;
        }
    };
    this.addEvent = function (elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        if (elmt.addEventListener) {
            if (eventName == "mousewheel") {
                elmt.addEventListener("DOMMouseScroll", handler, useCapture);
            }
            elmt.addEventListener(eventName, handler, useCapture);
        } else if (elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if (useCapture && elmt.setCapture) {
                elmt.setCapture();
            }
        } else {
            Seadragon.Debug.fail("Unable to attach event handler, no known technique.");
        }
    };
    this.removeEvent = function (elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);
        if (elmt.removeEventListener) {
            if (eventName == "mousewheel") {
                elmt.removeEventListener("DOMMouseScroll", handler, useCapture);
            }
            elmt.removeEventListener(eventName, handler, useCapture);
        } else if (elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if (useCapture && elmt.releaseCapture) {
                elmt.releaseCapture();
            }
        } else {
            Seadragon.Debug.fail("Unable to detach event handler, no known technique.");
        }
    };
    this.cancelEvent = function (event) {
        var event = self.getEvent(event);
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.cancel = true;
        event.returnValue = false;
    };
    this.stopEvent = function (event) {
        var event = self.getEvent(event);
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        event.cancelBubble = true;
    };
    this.createCallback = function (object, method) {
        var initialArgs = [];
        for (var i = 2; i < arguments.length; i++) {
            initialArgs.push(arguments[i]);
        }
        return function () {
            var args = initialArgs.concat([]);
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return method.apply(object, args);
        };
    };
    this.getUrlParameter = function (key) {
        var value = urlParams[key];
        return value ? value : null;
    };
    this.makeAjaxRequest = function (url, callback) {
        var async = typeof (callback) == "function";
        var req = null;
        if (async) {
            var actual = callback;
            var callback = function () {
                window.setTimeout(Seadragon.Utils.createCallback(null, actual, req), 1);
            };
        }
        if (window.ActiveXObject) {
            for (var i = 0; i < arrActiveX.length; i++) {
                try {
                    req = new ActiveXObject(arrActiveX[i]);
                    break;
                } catch (e) {
                    continue;
                }
            }
        } else if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        }
        if (!req) {
            Seadragon.Debug.fail("Browser doesn't support XMLHttpRequest.");
        }
        if (Seadragon.Config.proxyUrl) {
            url = Seadragon.Config.proxyUrl + url;
        }
        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    req.onreadystatechange = new Function();
                    callback();
                }
            };
        }
        try {
            req.open("GET", url, async);
            req.send(null);
        } catch (e) {
            Seadragon.Debug.log(e.name + " while making AJAX request: " + e.message);
            req.onreadystatechange = null;
            req = null;
            if (async) {
                callback();
            }
        }
        return async ? null : req;
    };
    this.parseXml = function (string) {
        var xmlDoc = null;
        if (window.ActiveXObject) {
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(string);
            } catch (e) {
                Seadragon.Debug.log(e.name + " while parsing XML (ActiveX): " + e.message);
            }
        } else if (window.DOMParser) {
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(string, "text/xml");
            } catch (e) {
                Seadragon.Debug.log(e.name + " while parsing XML (DOMParser): " + e.message);
            }
        } else {
            Seadragon.Debug.fail("Browser doesn't support XML DOM.");
        }
        return xmlDoc;
    };
};
Seadragon.Utils = new Seadragon.Utils();
(function () {
    if (Seadragon.MouseTracker) {
        return;
    }
    var lteIE8 = Seadragon.Utils.getBrowser() == Seadragon.Browser.IE && Seadragon.Utils.getBrowserVersion() < 9;
    var buttonDownAny = false;
    var ieCapturingAny = false;
    var ieTrackersActive = {};
    var ieTrackersCapturing = [];

    function getMouseAbsolute(event) {
        return Seadragon.Utils.getMousePosition(event);
    }

    function getMouseRelative(event, elmt) {
        var mouse = Seadragon.Utils.getMousePosition(event);
        var offset = Seadragon.Utils.getElementPosition(elmt);
        return mouse.minus(offset);
    }

    function isChild(elmtA, elmtB) {
        var body = document.body;
        while (elmtB && elmtA != elmtB && body != elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch (e) {
                return false;
            }
        }
        return elmtA == elmtB;
    }

    function onGlobalMouseDown() {
        buttonDownAny = true;
    }

    function onGlobalMouseUp() {
        buttonDownAny = false;
    }
    (function () {
        if (lteIE8) {
            Seadragon.Utils.addEvent(document, "mousedown", onGlobalMouseDown, false);
            Seadragon.Utils.addEvent(document, "mouseup", onGlobalMouseUp, false);
        } else {
            Seadragon.Utils.addEvent(window, "mousedown", onGlobalMouseDown, true);
            Seadragon.Utils.addEvent(window, "mouseup", onGlobalMouseUp, true);
        }
    })();
    Seadragon.MouseTracker = function (elmt) {
        var self = this;
        var ieSelf = null;
        var hash = Math.random();
        var elmt = Seadragon.Utils.getElement(elmt);
        var tracking = false;
        var capturing = false;
        var buttonDownElmt = false;
        var insideElmt = false;
        var lastPoint = null;
        var lastMouseDownTime = null;
        var lastMouseDownPoint = null;
        this.target = elmt;
        this.enterHandler = null;
        this.exitHandler = null;
        this.pressHandler = null;
        this.releaseHandler = null;
        this.clickHandler = null;
        this.dragHandler = null;
        this.scrollHandler = null;

        function startTracking() {
            if (!tracking) {
                Seadragon.Utils.addEvent(elmt, "mouseover", onMouseOver, false);
                Seadragon.Utils.addEvent(elmt, "mouseout", onMouseOut, false);
                Seadragon.Utils.addEvent(elmt, "mousedown", onMouseDown, false);
                Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
                Seadragon.Utils.addEvent(elmt, "mousewheel", onMouseScroll, false);
                Seadragon.Utils.addEvent(elmt, "click", onMouseClick, false);
                tracking = true;
                ieTrackersActive[hash] = ieSelf;
            }
        }

        function stopTracking() {
            if (tracking) {
                Seadragon.Utils.removeEvent(elmt, "mouseover", onMouseOver, false);
                Seadragon.Utils.removeEvent(elmt, "mouseout", onMouseOut, false);
                Seadragon.Utils.removeEvent(elmt, "mousedown", onMouseDown, false);
                Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
                Seadragon.Utils.removeEvent(elmt, "mousewheel", onMouseScroll, false);
                Seadragon.Utils.removeEvent(elmt, "click", onMouseClick, false);
                releaseMouse();
                tracking = false;
                delete ieTrackersActive[hash];
            }
        }

        function captureMouse() {
            if (!capturing) {
                if (lteIE8) {
                    Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
                    Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUpIE, true);
                    Seadragon.Utils.addEvent(elmt, "mousemove", onMouseMoveIE, true);
                } else {
                    Seadragon.Utils.addEvent(window, "mouseup", onMouseUpWindow, true);
                    Seadragon.Utils.addEvent(window, "mousemove", onMouseMove, true);
                }
                capturing = true;
            }
        }

        function releaseMouse() {
            if (capturing) {
                if (lteIE8) {
                    Seadragon.Utils.removeEvent(elmt, "mousemove", onMouseMoveIE, true);
                    Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUpIE, true);
                    Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
                } else {
                    Seadragon.Utils.removeEvent(window, "mousemove", onMouseMove, true);
                    Seadragon.Utils.removeEvent(window, "mouseup", onMouseUpWindow, true);
                }
                capturing = false;
            }
        }

        function triggerOthers(eventName, event) {
            var trackers = ieTrackersActive;
            for (var otherHash in trackers) {
                if (trackers.hasOwnProperty(otherHash) && hash != otherHash) {
                    trackers[otherHash][eventName](event);
                }
            }
        }

        function hasMouse() {
            return insideElmt;
        }

        function onMouseOver(event) {
            var event = Seadragon.Utils.getEvent(event);
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOver", event);
            }
            var to = event.target ? event.target : event.srcElement;
            var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
            if (!isChild(elmt, to) || isChild(elmt, from)) {
                return;
            }
            insideElmt = true;
            if (typeof (self.enterHandler) == "function") {
                try {
                    self.enterHandler(self, getMouseRelative(event, elmt), buttonDownElmt, buttonDownAny);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing enter handler: " + e.message, e);
                }
            }
        }

        function onMouseOut(event) {
            var event = Seadragon.Utils.getEvent(event);
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOut", event);
            }
            var from = event.target ? event.target : event.srcElement;
            var to = event.relatedTarget ? event.relatedTarget : event.toElement;
            if (!isChild(elmt, from) || isChild(elmt, to)) {
                return;
            }
            insideElmt = false;
            if (typeof (self.exitHandler) == "function") {
                try {
                    self.exitHandler(self, getMouseRelative(event, elmt), buttonDownElmt, buttonDownAny);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing exit handler: " + e.message, e);
                }
            }
        }

        function onMouseDown(event) {
            var event = Seadragon.Utils.getEvent(event);
            if (event.button == 2) {
                return;
            }
            buttonDownElmt = true;
            lastPoint = getMouseAbsolute(event);
            lastMouseDownPoint = lastPoint;
            lastMouseDownTime = new Date().getTime();
            if (typeof (self.pressHandler) == "function") {
                try {
                    self.pressHandler(self, getMouseRelative(event, elmt));
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing press handler: " + e.message, e);
                }
            }
            if (self.pressHandler || self.dragHandler) {
                Seadragon.Utils.cancelEvent(event);
            }
            if (!lteIE8 || !ieCapturingAny) {
                captureMouse();
                ieCapturingAny = true;
                ieTrackersCapturing = [ieSelf];
            } else if (lteIE8) {
                ieTrackersCapturing.push(ieSelf);
            }
        }

        function onMouseUp(event) {
            var event = Seadragon.Utils.getEvent(event);
            var insideElmtPress = buttonDownElmt;
            var insideElmtRelease = insideElmt;
            if (event.button == 2) {
                return;
            }
            buttonDownElmt = false;
            if (typeof (self.releaseHandler) == "function") {
                try {
                    self.releaseHandler(self, getMouseRelative(event, elmt), insideElmtPress, insideElmtRelease);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing release handler: " + e.message, e);
                }
            }
            if (insideElmtPress && insideElmtRelease) {
                handleMouseClick(event);
            }
        }

        function onMouseUpIE(event) {
            var event = Seadragon.Utils.getEvent(event);
            if (event.button == 2) {
                return;
            }
            for (var i = 0; i < ieTrackersCapturing.length; i++) {
                var tracker = ieTrackersCapturing[i];
                if (!tracker.hasMouse()) {
                    tracker.onMouseUp(event);
                }
            }
            releaseMouse();
            ieCapturingAny = false;
            event.srcElement.fireEvent("on" + event.type, document.createEventObject(event));
            Seadragon.Utils.stopEvent(event);
        }

        function onMouseUpWindow(event) {
            if (!insideElmt) {
                onMouseUp(event);
            }
            releaseMouse();
        }

        function onMouseClick(event) {
            if (self.clickHandler) {
                Seadragon.Utils.cancelEvent(event);
            }
        }

        function handleMouseClick(event) {
            var event = Seadragon.Utils.getEvent(event);
            if (event.button == 2) {
                return;
            }
            var time = new Date().getTime() - lastMouseDownTime;
            var point = getMouseAbsolute(event);
            var distance = lastMouseDownPoint.distanceTo(point);
            var quick = time <= Seadragon.Config.clickTimeThreshold && distance <= Seadragon.Config.clickDistThreshold;
            if (typeof (self.clickHandler) == "function") {
                try {
                    self.clickHandler(self, getMouseRelative(event, elmt), quick, event.shiftKey);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing click handler: " + e.message, e);
                }
            }
        }

        function onMouseMove(event) {
            var event = Seadragon.Utils.getEvent(event);
            var point = getMouseAbsolute(event);
            var delta = point.minus(lastPoint);
            lastPoint = point;
            if (typeof (self.dragHandler) == "function") {
                try {
                    self.dragHandler(self, getMouseRelative(event, elmt), delta, event.shiftKey);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing drag handler: " + e.message, e);
                }
                Seadragon.Utils.cancelEvent(event);
            }
        }

        function onMouseMoveIE(event) {
            for (var i = 0; i < ieTrackersCapturing.length; i++) {
                ieTrackersCapturing[i].onMouseMove(event);
            }
            Seadragon.Utils.stopEvent(event);
        }

        function onMouseScroll(event) {
            var event = Seadragon.Utils.getEvent(event);
            var delta = Seadragon.Utils.getMouseScroll(event);
            if (typeof (self.scrollHandler) == "function") {
                if (delta) {
                    try {
                        self.scrollHandler(self, getMouseRelative(event, elmt), delta, event.shiftKey);
                    } catch (e) {
                        Seadragon.Debug.error(e.name + " while executing scroll handler: " + e.message, e);
                    }
                }
                Seadragon.Utils.cancelEvent(event);
            }
        }


        (function () {
            ieSelf = {
                hasMouse: hasMouse,
                onMouseOver: onMouseOver,
                onMouseOut: onMouseOut,
                onMouseUp: onMouseUp,
                onMouseMove: onMouseMove
            };
        })();
        this.isTracking = function () {
            return tracking;
        };
        this.setTracking = function (track) {
            if (track) {
                startTracking();
            } else {
                stopTracking();
            }
        };
    };
})();

Seadragon.EventManager = function () {
    var listeners = {};
    this.addListener = function (eventName, handler) {
        if (typeof (handler) != "function") {
            return;
        }
        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }
        listeners[eventName].push(handler);
    };
    this.removeListener = function (eventName, handler) {
        var handlers = listeners[eventName];
        if (typeof (handler) != "function") {
            return;
        } else if (!handlers) {
            return;
        }
        for (var i = 0; i < handlers.length; i++) {
            if (handler == handlers[i]) {
                handlers.splice(i, 1);
                return;
            }
        }
    };
    this.clearListeners = function (eventName) {
        if (listeners[eventName]) {
            delete listeners[eventName];
        }
    };
    this.trigger = function (eventName) {
        var handlers = listeners[eventName];
        var args = [];
        if (!handlers) {
            return;
        }
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (var i = 0; i < handlers.length; i++) {
            try {
                handlers[i].apply(window, args);
            } catch (e) {
                Seadragon.Debug.error(e.name + " while executing " + eventName + " handler: " + e.message, e);
            }
        }
    };
};

(function () {
    var TIMEOUT = 5000;

    function Job(src, callback) {
        var image = null;
        var timeout = null;

        function finish(success) {
            image.onload = null;
            image.onabort = null;
            image.onerror = null;
            if (timeout) {
                window.clearTimeout(timeout);
            }
            window.setTimeout(function () {
                callback(src, success ? image : null);
            }, 1);
        }
        this.start = function () {
            image = new Image();
            var successFunc = function () {
                finish(true);
            };
            var failureFunc = function () {
                finish(false);
            };
            var timeoutFunc = function () {
                Seadragon.Debug.log("Image timed out: " + src);
                finish(false);
            };
            image.onload = successFunc;
            image.onabort = failureFunc;
            image.onerror = failureFunc;
            timeout = window.setTimeout(timeoutFunc, TIMEOUT);
            image.src = src;
        };
    }
    Seadragon.ImageLoader = function () {
        var downloading = 0;

        function onComplete(callback, src, image) {
            downloading--;
            if (typeof (callback) == "function") {
                try {
                    callback(image);
                } catch (e) {
                    Seadragon.Debug.error(e.name + " while executing " + src + " callback: " + e.message, e);
                }
            }
        }
        this.loadImage = function (src, callback) {
            if (downloading >= Seadragon.Config.imageLoaderLimit) {
                return false;
            }
            var func = Seadragon.Utils.createCallback(null, onComplete, callback);
            var job = new Job(src, func);
            downloading++;
            job.start();
            return true;
        };
    };
})();
(function () {
    var ButtonState = {
        REST: 0,
        GROUP: 1,
        HOVER: 2,
        DOWN: 3
    };
    Seadragon.Button = function (tooltip, srcRest, srcGroup, srcHover, srcDown, onPress, onRelease, onClick, onEnter, onExit) {
        var button = Seadragon.Utils.makeNeutralElement("span");
        var currentState = ButtonState.GROUP;
        var tracker = new Seadragon.MouseTracker(button);
        var imgRest = Seadragon.Utils.makeTransparentImage(srcRest);
        var imgGroup = Seadragon.Utils.makeTransparentImage(srcGroup);
        var imgHover = Seadragon.Utils.makeTransparentImage(srcHover);
        var imgDown = Seadragon.Utils.makeTransparentImage(srcDown);
        var onPress = typeof (onPress) == "function" ? onPress : null;
        var onRelease = typeof (onRelease) == "function" ? onRelease : null;
        var onClick = typeof (onClick) == "function" ? onClick : null;
        var onEnter = typeof (onEnter) == "function" ? onEnter : null;
        var onExit = typeof (onExit) == "function" ? onExit : null;
        var fadeDelay = 0;
        var fadeLength = 2000;
        var fadeBeginTime = null;
        var shouldFade = false;
        this.elmt = button;

        function scheduleFade() {
            window.setTimeout(updateFade, 20);
        }

        function updateFade() {
            if (shouldFade) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - fadeBeginTime;
                var opacity = 1.0 - deltaTime / fadeLength;
                opacity = Math.min(1.0, opacity);
                opacity = Math.max(0.0, opacity);
                Seadragon.Utils.setElementOpacity(imgGroup, opacity, true);
                if (opacity > 0) {
                    scheduleFade();
                }
            }
        }

        function beginFading() {
            shouldFade = true;
            fadeBeginTime = new Date().getTime() + fadeDelay;
            window.setTimeout(scheduleFade, fadeDelay);
        }

        function stopFading() {
            shouldFade = false;
            Seadragon.Utils.setElementOpacity(imgGroup, 1.0, true);
        }

        function inTo(newState) {
            if (newState >= ButtonState.GROUP && currentState == ButtonState.REST) {
                stopFading();
                currentState = ButtonState.GROUP;
            }
            if (newState >= ButtonState.HOVER && currentState == ButtonState.GROUP) {
                imgHover.style.visibility = "";
                currentState = ButtonState.HOVER;
            }
            if (newState >= ButtonState.DOWN && currentState == ButtonState.HOVER) {
                imgDown.style.visibility = "";
                currentState = ButtonState.DOWN;
            }
        }

        function outTo(newState) {
            if (newState <= ButtonState.HOVER && currentState == ButtonState.DOWN) {
                imgDown.style.visibility = "hidden";
                currentState = ButtonState.HOVER;
            }
            if (newState <= ButtonState.GROUP && currentState == ButtonState.HOVER) {
                imgHover.style.visibility = "hidden";
                currentState = ButtonState.GROUP;
            }
            if (newState <= ButtonState.REST && currentState == ButtonState.GROUP) {
                beginFading();
                currentState = ButtonState.REST;
            }
        }

        function enterHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            if (buttonDownElmt) {
                inTo(ButtonState.DOWN);
                if (onEnter) {
                    onEnter();
                }
            } else if (!buttonDownAny) {
                inTo(ButtonState.HOVER);
            }
        }

        function exitHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            outTo(ButtonState.GROUP);
            if (buttonDownElmt && onExit) {
                onExit();
            }
        }

        function pressHandler(tracker, position) {
            inTo(ButtonState.DOWN);
            if (onPress) {
                onPress();
            }
        }

        function releaseHandler(tracker, position, insideElmtPress, insideElmtRelease) {
            if (insideElmtPress && insideElmtRelease) {
                outTo(ButtonState.HOVER);
                if (onRelease) {
                    onRelease();
                }
            } else if (insideElmtPress) {
                outTo(ButtonState.GROUP);
            } else {
                inTo(ButtonState.HOVER);
            }
        }

        function clickHandler(tracker, position, quick, shift) {
            if (onClick && quick) {
                onClick();
            }
        }
        this.notifyGroupEnter = function () {
            inTo(ButtonState.GROUP);
        };
        this.notifyGroupExit = function () {
            outTo(ButtonState.REST);
        };
        (function () {
            button.style.display = "inline-block";
            button.style.position = "relative";
            button.title = tooltip;
            button.appendChild(imgRest);
            button.appendChild(imgGroup);
            button.appendChild(imgHover);
            button.appendChild(imgDown);
            var styleRest = imgRest.style;
            var styleGroup = imgGroup.style;
            var styleHover = imgHover.style;
            var styleDown = imgDown.style;
            styleGroup.position = styleHover.position = styleDown.position = "absolute";
            styleGroup.top = styleHover.top = styleDown.top = "0px";
            styleGroup.left = styleHover.left = styleDown.left = "0px";
            styleHover.visibility = styleDown.visibility = "hidden";
            if (Seadragon.Utils.getBrowser() == Seadragon.Browser.FIREFOX && Seadragon.Utils.getBrowserVersion() < 3) {
                styleGroup.top = styleHover.top = styleDown.top = "";
            }
            tracker.enterHandler = enterHandler;
            tracker.exitHandler = exitHandler;
            tracker.pressHandler = pressHandler;
            tracker.releaseHandler = releaseHandler;
            tracker.clickHandler = clickHandler;
            tracker.setTracking(true);
            outTo(ButtonState.REST);
        })();
    };
    Seadragon.ButtonGroup = function (buttons) {
        var group = Seadragon.Utils.makeNeutralElement("span");
        var buttons = buttons.concat([]);
        var tracker = new Seadragon.MouseTracker(group);
        this.elmt = group;

        function enterHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].notifyGroupEnter();
            }
        }

        function exitHandler(tracker, position, buttonDownElmt, buttonDownAny) {
            if (!buttonDownElmt) {
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].notifyGroupExit();
                }
            }
        }

        function releaseHandler(tracker, position, insideElmtPress, insideElmtRelease) {
            if (!insideElmtRelease) {
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].notifyGroupExit();
                }
            }
        }
        this.emulateEnter = function () {
            enterHandler();
        };
        this.emulateExit = function () {
            exitHandler();
        };
        (function () {
            group.style.display = "inline-block";
            for (var i = 0; i < buttons.length; i++) {
                group.appendChild(buttons[i].elmt);
            }
            tracker.enterHandler = enterHandler;
            tracker.exitHandler = exitHandler;
            tracker.releaseHandler = releaseHandler;
            tracker.setTracking(true);
        })();
    };
})();
Seadragon.TileSource = function (width, height, tileSize, tileOverlap, minLevel, maxLevel) {
    var self = this;
    var normHeight = height / width;
    this.aspectRatio = width / height;
    this.dimensions = new Seadragon.Point(width, height);
    this.minLevel = minLevel ? minLevel : 0;
    this.maxLevel = maxLevel ? maxLevel : Math.ceil(Math.log(Math.max(width, height)) / Math.log(2));
    this.tileSize = tileSize ? tileSize : 0;
    this.tileOverlap = tileOverlap ? tileOverlap : 0;
    this.getLevelScale = function (level) {
        return 1 / (1 << (self.maxLevel - level));
    };
    this.getNumTiles = function (level) {
        var scale = self.getLevelScale(level);
        var x = Math.ceil(scale * self.dimensions.x / self.tileSize);
        var y = Math.ceil(scale * self.dimensions.y / self.tileSize);
        return new Seadragon.Point(x, y);
    };
    this.getPixelRatio = function (level) {
        var imageSizeScaled = self.dimensions.times(self.getLevelScale(level));
        var rx = 1.0 / imageSizeScaled.x;
        var ry = 1.0 / imageSizeScaled.y;
        return new Seadragon.Point(rx, ry);
    };
    this.getTileAtPoint = function (level, point) {
        var scaledSize = self.dimensions.times(self.getLevelScale(level));
        var pixel = point.times(scaledSize.x);
        var tx, ty;
        if (point.x >= 0.0 && point.x <= 1.0) {
            tx = Math.floor(pixel.x / self.tileSize);
        } else {
            tx = Math.ceil(scaledSize.x / self.tileSize) * Math.floor(pixel.x / scaledSize.x) +
                Math.floor(((scaledSize.x + (pixel.x % scaledSize.x)) % scaledSize.x) / self.tileSize);
        }
        if (point.y >= 0.0 && point.y <= normHeight) {
            ty = Math.floor(pixel.y / self.tileSize);
        } else {
            ty = Math.ceil(scaledSize.y / self.tileSize) * Math.floor(pixel.y / scaledSize.y) +
                Math.floor(((scaledSize.y + (pixel.y % scaledSize.y)) % scaledSize.y) / self.tileSize);
        }
        return new Seadragon.Point(tx, ty);
    };
    this.getTileBounds = function (level, x, y) {
        var dimensionsScaled = self.dimensions.times(self.getLevelScale(level));
        var px = (x === 0) ? 0 : self.tileSize * x - self.tileOverlap;
        var py = (y === 0) ? 0 : self.tileSize * y - self.tileOverlap;
        var sx = self.tileSize + (x === 0 ? 1 : 2) * self.tileOverlap;
        var sy = self.tileSize + (y === 0 ? 1 : 2) * self.tileOverlap;
        sx = Math.min(sx, dimensionsScaled.x - px);
        sy = Math.min(sy, dimensionsScaled.y - py);
        var scale = 1.0 / dimensionsScaled.x;
        return new Seadragon.Rect(px * scale, py * scale, sx * scale, sy * scale);
    };
    this.getTileUrl = function (level, x, y) {
        throw new Error("Method not implemented.");
    };
    this.tileExists = function (level, x, y) {
        var numTiles = self.getNumTiles(level);
        return level >= self.minLevel && level <= self.maxLevel && x >= 0 && y >= 0 && x < numTiles.x && y < numTiles.y;
    };
};
Seadragon.DisplayRect = function (x, y, width, height, minLevel, maxLevel) {
    Seadragon.Rect.apply(this, arguments);
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
};
Seadragon.DisplayRect.prototype = new Seadragon.Rect();
Seadragon.DziTileSource = function (width, height, tileSize, tileOverlap, tilesUrl, fileFormat, displayRects) {
    Seadragon.TileSource.apply(this, [width, height, tileSize, tileOverlap]);
    var self = this;
    var levelRects = {};
    this.fileFormat = fileFormat;
    this.displayRects = displayRects;
    (function () {
        if (!displayRects) {
            return;
        }
        for (var i = displayRects.length - 1; i >= 0; i--) {
            var rect = displayRects[i];
            for (var level = rect.minLevel; level <= rect.maxLevel; level++) {
                if (!levelRects[level]) {
                    levelRects[level] = [];
                }
                levelRects[level].push(rect);
            }
        }
    })();
    this.getTileUrl = function (level, x, y) {
        return [tilesUrl, level, '/', x, '_', y, '.', fileFormat].join('');
    };
    this.tileExists = function (level, x, y) {
        var rects = levelRects[level];
        if (!rects || !rects.length) {
            return true;
        }
        for (var i = rects.length - 1; i >= 0; i--) {
            var rect = rects[i];
            if (level < rect.minLevel || level > rect.maxLevel) {
                continue;
            }
            var scale = self.getLevelScale(level);
            var xMin = rect.x * scale;
            var yMin = rect.y * scale;
            var xMax = xMin + rect.width * scale;
            var yMax = yMin + rect.height * scale;
            xMin = Math.floor(xMin / tileSize);
            yMin = Math.floor(yMin / tileSize);
            xMax = Math.ceil(xMax / tileSize);
            yMax = Math.ceil(yMax / tileSize);
            if (xMin <= x && x < xMax && yMin <= y && y < yMax) {
                return true;
            }
        }
        return false;
    };
};
Seadragon.DziTileSource.prototype = new Seadragon.TileSource();
(function () {
    function DziError(message) {
        Error.apply(this, arguments);
        this.message = message;
    }
    DziError.prototype = new Error();

    function getError(e) {
        if (!(e instanceof DziError)) {
            Seadragon.Debug.error(e.name + " while creating DZI from XML: " + e.message);
            e = new DziError(Seadragon.Strings.getString("Errors.Unknown"));
        }
        return e;
    }

    function processResponse(xhr, tilesUrl) {
        if (!xhr) {
            throw new DziError(Seadragon.Strings.getString("Errors.Security"));
        } else if (xhr.status !== 200 && xhr.status !== 0) {
            var status = xhr.status;
            var statusText = (status == 404) ? "Not Found" : xhr.statusText;
            throw new DziError(Seadragon.Strings.getString("Errors.Status", status, statusText));
        }
        var doc = null;
        if (xhr.responseXML && xhr.responseXML.documentElement) {
            doc = xhr.responseXML;
        } else if (xhr.responseText) {
            doc = Seadragon.Utils.parseXml(xhr.responseText);
        }
        return processXml(doc, tilesUrl);
    }

    function processXml(xmlDoc, tilesUrl) {
        if (!xmlDoc || !xmlDoc.documentElement) {
            throw new DziError(Seadragon.Strings.getString("Errors.Xml"));
        }
        var root = xmlDoc.documentElement;
        var rootName = root.tagName;
        if (rootName == "Image") {
            try {
                return processDzi(root, tilesUrl);
            } catch (e) {
                var defMsg = Seadragon.Strings.getString("Errors.Dzi");
                throw (e instanceof DziError) ? e : new DziError(defMsg);
            }
        } else if (rootName == "Collection") {
            throw new DziError(Seadragon.Strings.getString("Errors.Dzc"));
        } else if (rootName == "Error") {
            return processError(root);
        }
        throw new DziError(Seadragon.Strings.getString("Errors.Dzi"));
    }

    function processDzi(imageNode, tilesUrl) {
        var fileFormat = imageNode.getAttribute("Format");
        if (!Seadragon.Utils.imageFormatSupported(fileFormat)) {
            throw new DziError(Seadragon.Strings.getString("Errors.ImageFormat", fileFormat.toUpperCase()));
        }
        var sizeNode = imageNode.getElementsByTagName("Size")[0];
        var dispRectNodes = imageNode.getElementsByTagName("DisplayRect");
        var width = parseInt(sizeNode.getAttribute("Width"), 10);
        var height = parseInt(sizeNode.getAttribute("Height"), 10);
        var tileSize = parseInt(imageNode.getAttribute("TileSize"));
        var tileOverlap = parseInt(imageNode.getAttribute("Overlap"));
        var dispRects = [];
        for (var i = 0; i < dispRectNodes.length; i++) {
            var dispRectNode = dispRectNodes[i];
            var rectNode = dispRectNode.getElementsByTagName("Rect")[0];
            dispRects.push(new Seadragon.DisplayRect(parseInt(rectNode.getAttribute("X"), 10), parseInt(rectNode.getAttribute("Y"), 10), parseInt(rectNode.getAttribute("Width"), 10), parseInt(rectNode.getAttribute("Height"), 10), 0, parseInt(dispRectNode.getAttribute("MaxLevel"), 10)));
        }
        return new Seadragon.DziTileSource(width, height, tileSize, tileOverlap, tilesUrl, fileFormat, dispRects);
    }

    function processError(errorNode) {
        var messageNode = errorNode.getElementsByTagName("Message")[0];
        var message = messageNode.firstChild.nodeValue;
        throw new DziError(message);
    }
    Seadragon.DziTileSource.createFromXml = function (xmlUrl, xmlString, callback) {
        var async = typeof (callback) == "function";
        var error = null;
        if (!xmlUrl) {
            error = Seadragon.Strings.getString("Errors.Empty");
            if (async) {
                window.setTimeout(function () {
                    callback(null, error);
                }, 1);
                return null;
            }
            throw new DziError(error);
        }
        var urlParts = xmlUrl.split('/');
        var filename = urlParts[urlParts.length - 1];
        var lastDot = filename.lastIndexOf('.');
        if (lastDot > -1) {
            urlParts[urlParts.length - 1] = filename.slice(0, lastDot);
        }
        var tilesUrl = urlParts.join('/') + "_files/";

        function finish(func, obj) {
            try {
                return func(obj, tilesUrl);
            } catch (e) {
                if (async) {
                    error = getError(e).message;
                    return null;
                } else {
                    throw getError(e);
                }
            }
        }
        if (async) {
            if (xmlString) {
                window.setTimeout(function () {
                    var source = finish(processXml, Seadragon.Utils.parseXml(xmlString));
                    callback(source, error);
                }, 1);
            } else {
                Seadragon.Utils.makeAjaxRequest(xmlUrl, function (xhr) {
                    var source = finish(processResponse, xhr);
                    callback(source, error);
                });
            }
            return null;
        }
        if (xmlString) {
            return finish(processXml, Seadragon.Utils.parseXml(xmlString));
        } else {
            return finish(processResponse, Seadragon.Utils.makeAjaxRequest(xmlUrl));
        }
    };
})();
Seadragon.Viewport = function (containerSize, contentSize) {
    var self = this;
    var containerSize = new Seadragon.Point(containerSize.x, containerSize.y);
    var contentAspect = contentSize.x / contentSize.y;
    var contentHeight = contentSize.y / contentSize.x;
    var centerSpringX = new Seadragon.Spring(0);
    var centerSpringY = new Seadragon.Spring(0);
    var zoomSpring = new Seadragon.Spring(1);
    var zoomPoint = null;
    var homeBounds = new Seadragon.Rect(0, 0, 1, contentHeight);

    function init() {
        self.goHome(true);
        self.update();
    }

    function getHomeZoom() {
        var aspectFactor = contentAspect / self.getAspectRatio();
        return (aspectFactor >= 1) ? 1 : aspectFactor;
    }

    function getMinZoom() {
        var homeZoom = getHomeZoom();
        if (Seadragon.Config.minZoomDimension) {
            //var zoom = (contentSize.x <= contentSize.y) ? Seadragon.Config.minZoomDimension / containerSize.x : Seadragon.Config.minZoomDimension /
			//(containerSize.x*contentHeight);
			var zoom = 1;
        } else {
            //var zoom=Seadragon.Config.minZoomImageRatio*homeZoom;
            var zoom = 1;
        }
        //return Math.min(zoom, homeZoom);
		return Math.min(zoom);
    }

    function getMaxZoom() {
        var zoom = contentSize.x * Seadragon.Config.maxZoomPixelRatio / containerSize.x;
        return Math.max(zoom, getHomeZoom());
    }
    this.getAspectRatio = function () {
        return containerSize.x / containerSize.y;
    };
    this.getContainerSize = function () {
        return new Seadragon.Point(containerSize.x, containerSize.y);
    };
    this.getBounds = function (current) {
        var center = self.getCenter(current);
        var width = 1.0 / self.getZoom(current);
        var height = width / self.getAspectRatio();
        return new Seadragon.Rect(center.x - width / 2.0, center.y - height / 2.0, width, height);
    };
    this.getCenter = function (current) {
        var centerCurrent = new Seadragon.Point(centerSpringX.getCurrent(), centerSpringY.getCurrent());
        var centerTarget = new Seadragon.Point(centerSpringX.getTarget(), centerSpringY.getTarget());
        if (current) {
            return centerCurrent;
        } else if (!zoomPoint) {
            return centerTarget;
        }
        var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        var zoom = self.getZoom();
        var width = 1.0 / zoom;
        var height = width / self.getAspectRatio();
        var bounds = new Seadragon.Rect(centerCurrent.x - width / 2.0, centerCurrent.y - height / 2.0, width, height);
        var newZoomPixel = zoomPoint.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
        var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
        var deltaZoomPoints = deltaZoomPixels.divide(containerSize.x * zoom);
        return centerTarget.plus(deltaZoomPoints);
    };
    this.getZoom = function (current) {
        if (current) {
            return zoomSpring.getCurrent();
        } else {
            return zoomSpring.getTarget();
        }
    };
    this.applyConstraints = function (immediately) {
        var actualZoom = self.getZoom();
        var constrainedZoom = Math.max(Math.min(actualZoom, getMaxZoom()), getMinZoom());
        if (actualZoom != constrainedZoom) {
            self.zoomTo(constrainedZoom, zoomPoint, immediately);
        }
        var bounds = self.getBounds();
        var visibilityRatio = Seadragon.Config.visibilityRatio;
        var horThres = visibilityRatio * bounds.width;
        var verThres = visibilityRatio * bounds.height;
        var left = bounds.x + bounds.width;
        var right = 1 - bounds.x;
        var top = bounds.y + bounds.height;
        var bottom = contentHeight - bounds.y;
        var dx = 0;
        if (Seadragon.Config.wrapHorizontal) {} else if (left < horThres) {
            dx = horThres - left;
        } else if (right < horThres) {
            dx = right - horThres;
        }
        var dy = 0;
        if (Seadragon.Config.wrapVertical) {} else if (top < verThres) {
            dy = verThres - top;
        } else if (bottom < verThres) {
            dy = bottom - verThres;
        }
        if (dx || dy) {
            bounds.x += dx;
            bounds.y += dy;
            self.fitBounds(bounds, immediately);
        }
    };
    this.ensureVisible = function (immediately) {
        self.applyConstraints(immediately);
    };
    this.fitBounds = function (bounds, immediately) {
        var aspect = self.getAspectRatio();
        var center = bounds.getCenter();
        var newBounds = new Seadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        if (newBounds.getAspectRatio() >= aspect) {
            newBounds.height = bounds.width / aspect;
            newBounds.y = center.y - newBounds.height / 2;
        } else {
            newBounds.width = bounds.height * aspect;
            newBounds.x = center.x - newBounds.width / 2;
        }
        self.panTo(self.getCenter(true), true);
        self.zoomTo(self.getZoom(true), null, true);
        var oldBounds = self.getBounds();
        var oldZoom = self.getZoom();
        var newZoom = 1.0 / newBounds.width;
        if (newZoom == oldZoom || newBounds.width == oldBounds.width) {
            self.panTo(center, immediately);
            return;
        }
        var refPoint = oldBounds.getTopLeft().times(containerSize.x / oldBounds.width).minus(newBounds.getTopLeft().times(containerSize.x / newBounds.width)).divide(containerSize.x / oldBounds.width - containerSize.x / newBounds.width);
        self.zoomTo(newZoom, refPoint, immediately);
    };
    this.goHome = function (immediately) {
        var center = self.getCenter();
        if (Seadragon.Config.wrapHorizontal) {
            center.x = (1 + (center.x % 1)) % 1;
            centerSpringX.resetTo(center.x);
            centerSpringX.update();
        }
        if (Seadragon.Config.wrapVertical) {
            center.y = (contentHeight + (center.y % contentHeight)) % contentHeight;
            centerSpringY.resetTo(center.y);
            centerSpringY.update();
        }
        self.fitBounds(homeBounds, immediately);
    };
    this.panBy = function (delta, immediately) {
        var center = new Seadragon.Point(centerSpringX.getTarget(), centerSpringY.getTarget());
        self.panTo(center.plus(delta), immediately);
    };
    this.panTo = function (center, immediately) {
        if (immediately) {
            centerSpringX.resetTo(center.x);
            centerSpringY.resetTo(center.y);
        } else {
            centerSpringX.springTo(center.x);
            centerSpringY.springTo(center.y);
        }
    };
    this.zoomBy = function (factor, refPoint, immediately) {
        self.zoomTo(zoomSpring.getTarget() * factor, refPoint, immediately);
    };
    this.zoomTo = function (zoom, refPoint, immediately) {
        if (immediately) {
            zoomSpring.resetTo(zoom);
        } else {
            zoomSpring.springTo(zoom);
        }
        zoomPoint = refPoint instanceof Seadragon.Point ? refPoint : null;
    };
    this.resize = function (newContainerSize, maintain) {
        var oldBounds = self.getBounds();
        var newBounds = oldBounds;
        var widthDeltaFactor = newContainerSize.x / containerSize.x;
        containerSize = new Seadragon.Point(newContainerSize.x, newContainerSize.y);
        if (maintain) {
            newBounds.width = oldBounds.width * widthDeltaFactor;
            newBounds.height = newBounds.width / self.getAspectRatio();
        }
        self.fitBounds(newBounds, true);
    };
    this.update = function () {
        var oldCenterX = centerSpringX.getCurrent();
        var oldCenterY = centerSpringY.getCurrent();
        var oldZoom = zoomSpring.getCurrent();
        if (zoomPoint) {
            var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        }
        zoomSpring.update();
        if (zoomPoint && zoomSpring.getCurrent() != oldZoom) {
            var newZoomPixel = self.pixelFromPoint(zoomPoint, true);
            var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
            var deltaZoomPoints = self.deltaPointsFromPixels(deltaZoomPixels, true);
            centerSpringX.shiftBy(deltaZoomPoints.x);
            centerSpringY.shiftBy(deltaZoomPoints.y);
        } else {
            zoomPoint = null;
        }
        centerSpringX.update();
        centerSpringY.update();
        return centerSpringX.getCurrent() != oldCenterX || centerSpringY.getCurrent() != oldCenterY || zoomSpring.getCurrent() != oldZoom;
    };
    this.deltaPixelsFromPoints = function (deltaPoints, current) {
        return deltaPoints.times(containerSize.x * self.getZoom(current));
    };
    this.deltaPointsFromPixels = function (deltaPixels, current) {
        return deltaPixels.divide(containerSize.x * self.getZoom(current));
    };
    this.pixelFromPoint = function (point, current) {
        var bounds = self.getBounds(current);
        return point.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
    };
    this.pointFromPixel = function (pixel, current) {
        var bounds = self.getBounds(current);
        return pixel.divide(containerSize.x / bounds.width).plus(bounds.getTopLeft());
    };
    init();
};
(function () {
    var QUOTA = 250;
    var MIN_PIXEL_RATIO = 0.5;
    var browser = Seadragon.Utils.getBrowser();
    var browserVer = Seadragon.Utils.getBrowserVersion(); /*var badCanvas=(browser==Seadragon.Browser.SAFARI&&browserVer<4)||(browser==Seadragon.Browser.CHROME&&browserVer<2);*/
    var useCanvas = !! (document.createElement("canvas").getContext) /*&&!badCanvas*/ ;
    var MS_INTERPOLATION_MODE = (typeof document.documentMode !== "undefined") ? "bicubic" : "nearest-neighbor";

    function Tile(level, x, y, bounds, exists, url) {
        this.level = level;
        this.x = x;
        this.y = y;
        this.bounds = bounds;
        this.exists = exists;
        this.url = url;
        this.elmt = null;
        this.image = null;
        this.loaded = false;
        this.loading = false;
        this.style = null;
        this.position = null;
        this.size = null;
        this.blendStart = null;
        this.opacity = null;
        this.distance = null;
        this.visibility = null;
        this.beingDrawn = false;
        this.lastTouchTime = 0;
    }
    Tile.prototype.toString = function () {
        return this.level + "/" + this.x + "_" + this.y;
    };
    Tile.prototype.drawHTML = function (container) {
        if (!this.loaded) {
            Seadragon.Debug.error("Attempting to draw tile " + this.toString() + " when it's not yet loaded.");
            return;
        }
        if (!this.elmt) {
            this.elmt = Seadragon.Utils.makeNeutralElement("img");
            this.elmt.src = this.url;
            this.style = this.elmt.style;
            this.style.position = "absolute";
            this.style.msInterpolationMode = MS_INTERPOLATION_MODE;
        }
        var elmt = this.elmt;
        var style = this.style;
        var position = this.position.apply(Math.floor);
        var size = this.size.apply(Math.ceil);
        if (elmt.parentNode != container) {
            container.appendChild(elmt);
        }
        style.left = position.x + "px";
        style.top = position.y + "px";
        style.width = size.x + "px";
        style.height = size.y + "px";
        Seadragon.Utils.setElementOpacity(elmt, this.opacity);
    };
    Tile.prototype.drawCanvas = function (context) {
        if (!this.loaded) {
            Seadragon.Debug.error("Attempting to draw tile " + this.toString() + " when it's not yet loaded.");
            return;
        }
        var position = this.position;
        var size = this.size;
        context.globalAlpha = this.opacity;
        context.drawImage(this.image, position.x, position.y, size.x, size.y);
    };
    Tile.prototype.unload = function () {
        if (this.elmt && this.elmt.parentNode) {
            this.elmt.parentNode.removeChild(this.elmt);
        }
        this.elmt = null;
        this.image = null;
        this.loaded = false;
        this.loading = false;
    }
    var Placement = {
        CENTER: 0,
        TOP_LEFT: 1,
        TOP: 2,
        TOP_RIGHT: 3,
        RIGHT: 4,
        BOTTOM_RIGHT: 5,
        BOTTOM: 6,
        BOTTOM_LEFT: 7,
        LEFT: 8
    };
    Seadragon.OverlayPlacement = Placement;

    function createAdjustmentFunction(placement) {
        switch (placement) {
        case Placement.TOP_LEFT:
            return function (position, size) {};
        case Placement.TOP:
            return function (position, size) {
                position.x -= size.x / 2;
            };
        case Placement.TOP_RIGHT:
            return function (position, size) {
                position.x -= size.x;
            };
        case Placement.RIGHT:
            return function (position, size) {
                position.x -= size.x;
                position.y -= size.y / 2;
            };
        case Placement.BOTTOM_RIGHT:
            return function (position, size) {
                position.x -= size.x;
                position.y -= size.y;
            };
        case Placement.BOTTOM:
            return function (position, size) {
                position.x -= size.x / 2;
                position.y -= size.y;
            };
        case Placement.BOTTOM_LEFT:
            return function (position, size) {
                position.y -= size.y;
            };
        case Placement.LEFT:
            return function (position, size) {
                position.y -= size.y / 2;
            };
        case Placement.CENTER:
        default:
            return function (position, size) {
                position.x -= size.x / 2;
                position.y -= size.y / 2;
            };
        }
    }

    function Overlay(elmt, loc, placement) {
        this.elmt = elmt;
        this.scales = (loc instanceof Seadragon.Rect);
        this.bounds = new Seadragon.Rect(loc.x, loc.y, loc.width, loc.height);
        this.adjust = createAdjustmentFunction(loc instanceof Seadragon.Point ? placement : Placement.TOP_LEFT);
        this.position = new Seadragon.Point(loc.x, loc.y);
        this.size = new Seadragon.Point(loc.width, loc.height);
        this.style = elmt.style;
    }
    Overlay.prototype.destroy = function () {
        var elmt = this.elmt;
        var style = this.style;
        if (elmt.parentNode) {
            elmt.parentNode.removeChild(elmt);
        }
        style.top = "";
        style.left = "";
        style.position = "";
        if (this.scales) {
            style.width = "";
            style.height = "";
        }
    };
    Overlay.prototype.drawHTML = function (container) {
        var elmt = this.elmt;
        var style = this.style;
        var scales = this.scales;
        if (elmt.parentNode != container) {
            container.appendChild(elmt);
        }
        if (!scales) {
            this.size = Seadragon.Utils.getElementSize(elmt);
        }
        var position = this.position;
        var size = this.size;
        this.adjust(position, size);
        position = position.apply(Math.floor);
        size = size.apply(Math.ceil);
        style.left = position.x + "px";
        style.top = position.y + "px";
        style.position = "absolute";
        if (scales) {
            style.width = size.x + "px";
            style.height = size.y + "px";
        }
    };
    Overlay.prototype.update = function (loc, placement) {
        this.scales = (loc instanceof Seadragon.Rect);
        this.bounds = new Seadragon.Rect(loc.x, loc.y, loc.width, loc.height);
        this.adjust = createAdjustmentFunction(loc instanceof Seadragon.Point ? placement : Placement.TOP_LEFT);
    };
    Seadragon.Drawer = function (source, viewport, elmt) {
        var container = Seadragon.Utils.getElement(elmt);
        var canvas = Seadragon.Utils.makeNeutralElement(useCanvas ? "canvas" : "div");
        var context = useCanvas ? canvas.getContext("2d") : null;
        var imageLoader = new Seadragon.ImageLoader();
        var profiler = new Seadragon.Profiler();
        var minLevel = source.minLevel;
        var maxLevel = source.maxLevel;
        var tileSize = source.tileSize;
        var tileOverlap = source.tileOverlap;
        var normHeight = source.dimensions.y / source.dimensions.x;
        var cacheNumTiles = {};
        var cachePixelRatios = {};
        var tilesMatrix = {};
        var tilesLoaded = [];
        var coverage = {};
        var overlays = [];
        var lastDrawn = [];
        var lastResetTime = 0;
        var midUpdate = false;
        var updateAgain = true;
        this.elmt = container;
        this.profiler = profiler;
        (function () {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.position = "absolute";
            container.style.textAlign = "left";
            container.appendChild(canvas);
        })();

        function getNumTiles(level) {
            if (!cacheNumTiles[level]) {
                cacheNumTiles[level] = source.getNumTiles(level);
            }
            return cacheNumTiles[level];
        }

        function getPixelRatio(level) {
            if (!cachePixelRatios[level]) {
                cachePixelRatios[level] = source.getPixelRatio(level);
            }
            return cachePixelRatios[level];
        }

        function getTile(level, x, y, time, numTilesX, numTilesY) {
            if (!tilesMatrix[level]) {
                tilesMatrix[level] = {};
            }
            if (!tilesMatrix[level][x]) {
                tilesMatrix[level][x] = {};
            }
            if (!tilesMatrix[level][x][y]) {
                var xMod = (numTilesX + (x % numTilesX)) % numTilesX;
                var yMod = (numTilesY + (y % numTilesY)) % numTilesY;
                var bounds = source.getTileBounds(level, xMod, yMod);
                var exists = source.tileExists(level, xMod, yMod);
                var url = source.getTileUrl(level, xMod, yMod);
                bounds.x += 1.0 * (x - xMod) / numTilesX;
                bounds.y += normHeight * (y - yMod) / numTilesY;
                tilesMatrix[level][x][y] = new Tile(level, x, y, bounds, exists, url);
            }
            var tile = tilesMatrix[level][x][y];
            tile.lastTouchTime = time;
            return tile;
        }

        function loadTile(tile, time) {
            tile.loading = imageLoader.loadImage(tile.url, Seadragon.Utils.createCallback(null, onTileLoad, tile, time));
        }

        function onTileLoad(tile, time, image) {
            tile.loading = false;
            if (midUpdate) {
                Seadragon.Debug.error("Tile load callback in middle of drawing routine.");
                return;
            } else if (!image) {
                Seadragon.Debug.log("Tile " + tile + " failed to load: " + tile.url);
                tile.exists = false;
                return;
            } else if (time < lastResetTime) {
                Seadragon.Debug.log("Ignoring tile " + tile + " loaded before reset: " + tile.url);
                return;
            }
            tile.loaded = true;
            tile.image = image;
            var insertionIndex = tilesLoaded.length;
            if (tilesLoaded.length >= QUOTA) {
                var cutoff = Math.ceil(Math.log(tileSize) / Math.log(2));
                var worstTile = null;
                var worstTileIndex = -1;
                for (var i = tilesLoaded.length - 1; i >= 0; i--) {
                    var prevTile = tilesLoaded[i];
                    if (prevTile.level <= cutoff || prevTile.beingDrawn) {
                        continue;
                    } else if (!worstTile) {
                        worstTile = prevTile;
                        worstTileIndex = i;
                        continue;
                    }
                    var prevTime = prevTile.lastTouchTime;
                    var worstTime = worstTile.lastTouchTime;
                    var prevLevel = prevTile.level;
                    var worstLevel = worstTile.level;
                    if (prevTime < worstTime || (prevTime == worstTime && prevLevel > worstLevel)) {
                        worstTile = prevTile;
                        worstTileIndex = i;
                    }
                }
                if (worstTile && worstTileIndex >= 0) {
                    worstTile.unload();
                    insertionIndex = worstTileIndex;
                }
            }
            tilesLoaded[insertionIndex] = tile;
            updateAgain = true;
        }

        function clearTiles() {
            tilesMatrix = {};
            tilesLoaded = [];
        }

        function providesCoverage(level, x, y) {
            if (!coverage[level]) {
                return false;
            }
            if (x === undefined || y === undefined) {
                var rows = coverage[level];
                for (var i in rows) {
                    if (rows.hasOwnProperty(i)) {
                        var cols = rows[i];
                        for (var j in cols) {
                            if (cols.hasOwnProperty(j) && !cols[j]) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            return (coverage[level][x] === undefined || coverage[level][x][y] === undefined || coverage[level][x][y] === true);
        }

        function isCovered(level, x, y) {
            if (x === undefined || y === undefined) {
                return providesCoverage(level + 1);
            } else {
                return (providesCoverage(level + 1, 2 * x, 2 * y) && providesCoverage(level + 1, 2 * x, 2 * y + 1) && providesCoverage(level + 1, 2 * x + 1, 2 * y) && providesCoverage(level + 1, 2 * x + 1, 2 * y + 1));
            }
        }

        function setCoverage(level, x, y, covers) {
            if (!coverage[level]) {
                Seadragon.Debug.error("Setting coverage for a tile before its " + "level's coverage has been reset: " + level);
                return;
            }
            if (!coverage[level][x]) {
                coverage[level][x] = {};
            }
            coverage[level][x][y] = covers;
        }

        function resetCoverage(level) {
            coverage[level] = {};
        }

        function compareTiles(prevBest, tile) {
            if (!prevBest) {
                return tile;
            }
            if (tile.visibility > prevBest.visibility) {
                return tile;
            } else if (tile.visibility == prevBest.visibility) {
                if (tile.distance < prevBest.distance) {
                    return tile;
                }
            }
            return prevBest;
        }

        function getOverlayIndex(elmt) {
            for (var i = overlays.length - 1; i >= 0; i--) {
                if (overlays[i].elmt == elmt) {
                    return i;
                }
            }
            return -1;
        }

        function updateActual() {
            updateAgain = false;
            var _canvas = canvas;
            var _context = context;
            var _container = container;
            var _useCanvas = useCanvas;
            var _lastDrawn = lastDrawn;
            while (_lastDrawn.length > 0) {
                var tile = _lastDrawn.pop();
                tile.beingDrawn = false;
            }
            var viewportSize = viewport.getContainerSize();
            var viewportWidth = viewportSize.x;
            var viewportHeight = viewportSize.y;
            _canvas.innerHTML = "";
            if (_useCanvas) {
                _canvas.width = viewportWidth;
                _canvas.height = viewportHeight;
                _context.clearRect(0, 0, viewportWidth, viewportHeight);
            }
            var viewportBounds = viewport.getBounds(true);
            var viewportTL = viewportBounds.getTopLeft();
            var viewportBR = viewportBounds.getBottomRight();
            if (!Seadragon.Config.wrapHorizontal && (viewportBR.x < 0 || viewportTL.x > 1)) {
                return;
            } else if (!Seadragon.Config.wrapVertical && (viewportBR.y < 0 || viewportTL.y > normHeight)) {
                return;
            }
            var _getNumTiles = getNumTiles;
            var _getPixelRatio = getPixelRatio;
            var _getTile = getTile;
            var _isCovered = isCovered;
            var _setCoverage = setCoverage;
            var _resetCoverage = resetCoverage;
            var _providesCoverage = providesCoverage;
            var _tileOverlap = tileOverlap;
            var _abs = Math.abs;
            var _ceil = Math.ceil;
            var _floor = Math.floor;
            var _log = Math.log;
            var _max = Math.max;
            var _min = Math.min;
            var _deltaPixelsFromPoints = viewport.deltaPixelsFromPoints;
            var _pixelFromPoint = viewport.pixelFromPoint;
            var _getTileAtPoint = source.getTileAtPoint;
            var alwaysBlend = Seadragon.Config.alwaysBlend;
            var blendTimeMillis = 1000 * Seadragon.Config.blendTime;
            var immediateRender = Seadragon.Config.immediateRender;
            var minDimension = Seadragon.Config.minZoomDimension;
            var minImageRatio = Seadragon.Config.minImageRatio;
            var wrapHorizontal = Seadragon.Config.wrapHorizontal;
            var wrapVertical = Seadragon.Config.wrapVertical;
            var wrapOverlays = Seadragon.Config.wrapOverlays;
            if (!wrapHorizontal) {
                viewportTL.x = _max(viewportTL.x, 0);
                viewportBR.x = _min(viewportBR.x, 1);
            }
            if (!wrapVertical) {
                viewportTL.y = _max(viewportTL.y, 0);
                viewportBR.y = _min(viewportBR.y, normHeight);
            }
            var best = null;
            var haveDrawn = false;
            var currentTime = new Date().getTime();
            var viewportCenterPoint = viewport.getCenter();
            var viewportCenterPixel = _pixelFromPoint(viewportCenterPoint);
            var zeroRatioT = _deltaPixelsFromPoints(_getPixelRatio(0), false).x;
            var optimalPixelRatio = immediateRender ? 1 : zeroRatioT;
            minDimension = minDimension || 64;
            var lowestLevel = _max(minLevel, _floor(_log(minDimension) / _log(2)));
            var zeroRatioC = _deltaPixelsFromPoints(_getPixelRatio(0), true).x;
            var highestLevel = _min(maxLevel, _floor(_log(zeroRatioC / MIN_PIXEL_RATIO) / _log(2)));
            lowestLevel = _min(lowestLevel, highestLevel);
            for (var level = highestLevel; level >= lowestLevel; level--) {
                var drawLevel = false;
                var renderPixelRatioC = _deltaPixelsFromPoints(_getPixelRatio(level), true).x;
                if ((!haveDrawn && renderPixelRatioC >= MIN_PIXEL_RATIO) || level == lowestLevel) {
                    drawLevel = true;
                    haveDrawn = true;
                } else if (!haveDrawn) {
                    continue;
                }
                _resetCoverage(level);
                var levelOpacity = _min(1, (renderPixelRatioC - 0.5) / 0.5);
                var renderPixelRatioT = _deltaPixelsFromPoints(_getPixelRatio(level), false).x;
                var levelVisibility = optimalPixelRatio / _abs(optimalPixelRatio - renderPixelRatioT);
                var tileTL = _getTileAtPoint(level, viewportTL);
                var tileBR = _getTileAtPoint(level, viewportBR);
                var numTiles = _getNumTiles(level);
                var numTilesX = numTiles.x;
                var numTilesY = numTiles.y;
                if (!wrapHorizontal) {
                    tileBR.x = _min(tileBR.x, numTilesX - 1);
                }
                if (!wrapVertical) {
                    tileBR.y = _min(tileBR.y, numTilesY - 1);
                }
                for (var x = tileTL.x; x <= tileBR.x; x++) {
                    for (var y = tileTL.y; y <= tileBR.y; y++) {
                        var tile = _getTile(level, x, y, currentTime, numTilesX, numTilesY);
                        var drawTile = drawLevel;
                        _setCoverage(level, x, y, false);
                        if (!tile.exists) {
                            continue;
                        }
                        if (haveDrawn && !drawTile) {
                            if (_isCovered(level, x, y)) {
                                _setCoverage(level, x, y, true);
                            } else {
                                drawTile = true;
                            }
                        }
                        if (!drawTile) {
                            continue;
                        }
                        var boundsTL = tile.bounds.getTopLeft();
                        var boundsSize = tile.bounds.getSize();
                        var positionC = _pixelFromPoint(boundsTL, true);
                        var sizeC = _deltaPixelsFromPoints(boundsSize, true);
                        if (!_tileOverlap) {
                            sizeC = sizeC.plus(new Seadragon.Point(1, 1));
                        }
                        var positionT = _pixelFromPoint(boundsTL, false);
                        var sizeT = _deltaPixelsFromPoints(boundsSize, false);
                        var tileCenter = positionT.plus(sizeT.divide(2));
                        var tileDistance = viewportCenterPixel.distanceTo(tileCenter);
                        tile.position = positionC;
                        tile.size = sizeC;
                        tile.distance = tileDistance;
                        tile.visibility = levelVisibility;
                        if (tile.loaded) {
                            if (!tile.blendStart) {
                                tile.blendStart = currentTime;
                            }
                            var deltaTime = currentTime - tile.blendStart;
                            var opacity = _min(1, deltaTime / blendTimeMillis);
                            if (alwaysBlend) {
                                opacity *= levelOpacity;
                            }
                            tile.opacity = opacity;
                            _lastDrawn.push(tile);
                            if (opacity == 1) {
                                _setCoverage(level, x, y, true);
                            } else if (deltaTime < blendTimeMillis) {
                                updateAgain = true;
                            }
                        } else if (tile.loading) {} else {
                            best = compareTiles(best, tile);
                        }
                    }
                }
                if (_providesCoverage(level)) {
                    break;
                }
            }
            for (var i = _lastDrawn.length - 1; i >= 0; i--) {
                var tile = _lastDrawn[i];
                if (_useCanvas) {
                    tile.drawCanvas(_context);
                } else {
                    tile.drawHTML(_canvas);
                }
                tile.beingDrawn = true;
            }
            var numOverlays = overlays.length;
            for (var i = 0; i < numOverlays; i++) {
                var overlay = overlays[i];
                var bounds = overlay.bounds;
                var overlayTL = bounds.getTopLeft();
                if (wrapOverlays && wrapHorizontal) {
                    overlayTL.x += _floor(viewportCenterPoint.x);
                }
                if (wrapOverlays && wrapVertical) {}
                overlay.position = _pixelFromPoint(overlayTL, true);
                overlay.size = _deltaPixelsFromPoints(bounds.getSize(), true);
                overlay.drawHTML(container);
            }
            if (best) {
                loadTile(best, currentTime);
                updateAgain = true;
            }
        }
        this.addOverlay = function (elmt, loc, placement) {
            var elmt = Seadragon.Utils.getElement(elmt);
            if (getOverlayIndex(elmt) >= 0) {
                return;
            }
            overlays.push(new Overlay(elmt, loc, placement));
            updateAgain = true;
        };
        this.updateOverlay = function (elmt, loc, placement) {
            var elmt = Seadragon.Utils.getElement(elmt);
            var i = getOverlayIndex(elmt);
            if (i >= 0) {
                overlays[i].update(loc, placement);
                updateAgain = true;
            }
        };
        this.removeOverlay = function (elmt) {
            var elmt = Seadragon.Utils.getElement(elmt);
            var i = getOverlayIndex(elmt);
            if (i >= 0) {
                overlays[i].destroy();
                overlays.splice(i, 1);
                updateAgain = true;
            }
        };
        this.clearOverlays = function () {
            while (overlays.length > 0) {
                overlays.pop().destroy();
                updateAgain = true;
            }
        };
        this.needsUpdate = function () {
            return updateAgain;
        };
        this.numTilesLoaded = function () {
            return tilesLoaded.length;
        };
        this.reset = function () {
            clearTiles();
            lastResetTime = new Date().getTime();
            updateAgain = true;
        };
        this.update = function () {
            profiler.beginUpdate();
            midUpdate = true;
            updateActual();
            midUpdate = false;
            profiler.endUpdate();
        };
        this.idle = function () {};
    };
})();
(function () {
    var SIGNAL = "----seadragon----";
    var browser = Seadragon.Utils.getBrowser();
    var Anchor = {
        NONE: 0,
        TOP_LEFT: 1,
        TOP_RIGHT: 2,
        BOTTOM_RIGHT: 3,
        BOTTOM_LEFT: 4
    };
    Seadragon.ControlAnchor = Anchor;

    function addToAnchor(elmt, anchor, container) {
        if (anchor == Anchor.TOP_RIGHT || anchor == Anchor.BOTTOM_RIGHT) {
            container.insertBefore(elmt, container.firstChild);
        } else {
            container.appendChild(elmt);
        }
    }

    function Control(elmt, anchor, container) {
        var wrapper = Seadragon.Utils.makeNeutralElement("span");
        this.elmt = elmt;
        this.anchor = anchor;
        this.container = container;
        this.wrapper = wrapper;
        wrapper.style.display = "inline-block";
        wrapper.appendChild(elmt);
        if (anchor == Anchor.NONE) {
            wrapper.style.width = wrapper.style.height = "100%";
        }
        addToAnchor(wrapper, anchor, container);
    }
    Control.prototype.destroy = function () {
        this.wrapper.removeChild(this.elmt);
        this.container.removeChild(this.wrapper);
    };
    Control.prototype.isVisible = function () {
        return this.wrapper.style.display != "none";
    };
    Control.prototype.setVisible = function (visible) {
        this.wrapper.style.display = visible ? "inline-block" : "none";
    };
    Control.prototype.setOpacity = function (opacity) {
        if (this.elmt[SIGNAL] && browser == Seadragon.Browser.IE) {
            Seadragon.Utils.setElementOpacity(this.elmt, opacity, true);
        } else {
            Seadragon.Utils.setElementOpacity(this.wrapper, opacity, true);
        }
    }
    var FULL_PAGE = "fullpage";
    var HOME = "home";
    var ZOOM_IN = "zoomin";
    var ZOOM_OUT = "zoomout";
    var REST = "_rest.png";
    var GROUP = "_grouphover.png";
    var HOVER = "_hover.png";
    var DOWN = "_pressed.png";

    function makeNavControl(viewer) {
        var group = null;
        var zooming = false;
        var zoomFactor = null;
        var lastZoomTime = null;

        function onHome() {
            if (viewer.viewport) {
                viewer.viewport.goHome();
            }
        }

        function onFullPage() {
            viewer.setFullPage(!viewer.isFullPage());
            group.emulateExit();
            if (viewer.viewport) {
                viewer.viewport.applyConstraints();
            }
        }

        function beginZoomingIn() {
            lastZoomTime = new Date().getTime();
            zoomFactor = Seadragon.Config.zoomPerSecond;
            zooming = true;
            scheduleZoom();
        }

        function beginZoomingOut() {
            lastZoomTime = new Date().getTime();
            zoomFactor = 1.0 / Seadragon.Config.zoomPerSecond;
            zooming = true;
            scheduleZoom();
        }

        function endZooming() {
            zooming = false;
        }

        function scheduleZoom() {
            window.setTimeout(doZoom, 10);
        }

        function doZoom() {
            if (zooming && viewer.viewport) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - lastZoomTime;
                var adjustedFactor = Math.pow(zoomFactor, deltaTime / 1000);
                viewer.viewport.zoomBy(adjustedFactor);
                viewer.viewport.applyConstraints();
                lastZoomTime = currentTime;
                scheduleZoom();
            }
        }

        function doSingleZoomIn() {
            if (viewer.viewport) {
                zooming = false;
                viewer.viewport.zoomBy(Seadragon.Config.zoomPerClick / 1.0);
                viewer.viewport.applyConstraints();
            }
        }

        function doSingleZoomOut() {
            if (viewer.viewport) {
                zooming = false;
                viewer.viewport.zoomBy(1.0 / Seadragon.Config.zoomPerClick);
                viewer.viewport.applyConstraints();
            }
        }

        function lightUp() {
            group.emulateEnter();
            group.emulateExit();
        }

        function url(prefix, postfix) {
            return Seadragon.Config.imagePath + prefix + postfix;
        }
        var zoomIn = new Seadragon.Button(Seadragon.Strings.getString("Tooltips.ZoomIn"), url(ZOOM_IN, REST), url(ZOOM_IN, GROUP), url(ZOOM_IN, HOVER), url(ZOOM_IN, DOWN), beginZoomingIn, endZooming, doSingleZoomIn, beginZoomingIn, endZooming);
        var zoomOut = new Seadragon.Button(Seadragon.Strings.getString("Tooltips.ZoomOut"), url(ZOOM_OUT, REST), url(ZOOM_OUT, GROUP), url(ZOOM_OUT, HOVER), url(ZOOM_OUT, DOWN), beginZoomingOut, endZooming, doSingleZoomOut, beginZoomingOut, endZooming);
        var goHome = new Seadragon.Button(Seadragon.Strings.getString("Tooltips.Home"), url(HOME, REST), url(HOME, GROUP), url(HOME, HOVER), url(HOME, DOWN), null, onHome, null, null, null);
        var fullPage = new Seadragon.Button(Seadragon.Strings.getString("Tooltips.FullPage"), url(FULL_PAGE, REST), url(FULL_PAGE, GROUP), url(FULL_PAGE, HOVER), url(FULL_PAGE, DOWN), null, onFullPage, null, null, null);
        group = new Seadragon.ButtonGroup([zoomIn, zoomOut, goHome, fullPage]);
        group.elmt[SIGNAL] = true;
        viewer.addEventListener("open", lightUp);
        return group.elmt;
    }
    Seadragon.Viewer = function (container) {
        var self = this;
        var parent = Seadragon.Utils.getElement(container);
        var container = Seadragon.Utils.makeNeutralElement("div");
        var canvas = Seadragon.Utils.makeNeutralElement("div");
        var controlsTL = Seadragon.Utils.makeNeutralElement("div");
        var controlsTR = Seadragon.Utils.makeNeutralElement("div");
        var controlsBR = Seadragon.Utils.makeNeutralElement("div");
        var controlsBL = Seadragon.Utils.makeNeutralElement("div");
        var source = null;
        var drawer = null;
        var viewport = null;
        var profiler = null;
        var eventManager = new Seadragon.EventManager();
        var innerTracker = new Seadragon.MouseTracker(canvas);
        var outerTracker = new Seadragon.MouseTracker(container);
        var controls = [];
        var controlsShouldFade = true;
        var controlsFadeBeginTime = null;
        var navControl = null;
        var controlsFadeDelay = 1000;
        var controlsFadeLength = 2000;
        var controlsFadeBeginTime = null;
        var controlsShouldFade = false;
        var bodyWidth = document.body.style.width;
        var bodyHeight = document.body.style.height;
        var bodyOverflow = document.body.style.overflow;
        var docOverflow = document.documentElement.style.overflow;
        var fsBoundsDelta = new Seadragon.Point(1, 1);
        var prevContainerSize = null;
        var lastOpenStartTime = 0;
        var lastOpenEndTime = 0;
        var animating = false;
        var forceRedraw = false;
        var mouseInside = false;
        this.elmt = container;
        this.source = null;
        this.drawer = null;
        this.viewport = null;
        this.profiler = null;

        function initialize() {
            var canvasStyle = canvas.style;
            var containerStyle = container.style;
            var controlsTLStyle = controlsTL.style;
            var controlsTRStyle = controlsTR.style;
            var controlsBRStyle = controlsBR.style;
            var controlsBLStyle = controlsBL.style;
            containerStyle.width = "100%";
            containerStyle.height = "100%";
            containerStyle.position = "relative";
            containerStyle.left = "0px";
            containerStyle.top = "0px";
            containerStyle.textAlign = "left";
            canvasStyle.width = "100%";
            canvasStyle.height = "100%";
            canvasStyle.overflow = "hidden";
            canvasStyle.position = "absolute";
            canvasStyle.top = "0px";
            canvasStyle.left = "0px";
            controlsTLStyle.position = controlsTRStyle.position = controlsBRStyle.position = controlsBLStyle.position = "absolute";
            controlsTLStyle.top = controlsTRStyle.top = "0px";
            controlsTLStyle.left = controlsBLStyle.left = "0px";
            controlsTRStyle.right = controlsBRStyle.right = "0px";
            controlsBLStyle.bottom = controlsBRStyle.bottom = "0px";
            innerTracker.clickHandler = onCanvasClick;
            innerTracker.dragHandler = onCanvasDrag;
            innerTracker.releaseHandler = onCanvasRelease;
            innerTracker.scrollHandler = onCanvasScroll;
            innerTracker.setTracking(true);
            navControl = makeNavControl(self);
            navControl.style.marginRight = "4px";
            navControl.style.marginBottom = "4px";
            self.addControl(navControl, Anchor.BOTTOM_RIGHT);
            outerTracker.enterHandler = onContainerEnter;
            outerTracker.exitHandler = onContainerExit;
            outerTracker.releaseHandler = onContainerRelease;
            outerTracker.setTracking(true);
            window.setTimeout(beginControlsAutoHide, 1);
            container.appendChild(canvas);
            container.appendChild(controlsTL);
            container.appendChild(controlsTR);
            container.appendChild(controlsBR);
            container.appendChild(controlsBL);
            parent.innerHTML = "";
            parent.appendChild(container);
        }

        function setMessage(message) {
            var textNode = document.createTextNode(message);
            canvas.innerHTML = "";
            canvas.appendChild(Seadragon.Utils.makeCenteredNode(textNode));
            var textStyle = textNode.parentNode.style;
            textStyle.color = "white";
            textStyle.fontFamily = "verdana";
            textStyle.fontSize = "13px";
            textStyle.fontSizeAdjust = "none";
            textStyle.fontStyle = "normal";
            textStyle.fontStretch = "normal";
            textStyle.fontVariant = "normal";
            textStyle.fontWeight = "normal";
            textStyle.lineHeight = "1em";
            textStyle.textAlign = "center";
            textStyle.textDecoration = "none";
        }

        function beforeOpen() {
            if (source) {
                onClose();
            }
            lastOpenStartTime = new Date().getTime();
            window.setTimeout(function () {
                if (lastOpenStartTime > lastOpenEndTime) {
                    setMessage(Seadragon.Strings.getString("Messages.Loading"));
                }
            }, 2000);
            return lastOpenStartTime;
        }

        function onOpen(time, _source, error) {
            lastOpenEndTime = new Date().getTime();

            if (time < lastOpenStartTime) {
                Seadragon.Debug.log("Ignoring out-of-date open.");
                eventManager.trigger("ignore", self);
                return;
            } else if (!_source) {
                setMessage(error);
                eventManager.trigger("error", self);
                return;
            }

            canvas.innerHTML = "";
            prevContainerSize = Seadragon.Utils.getElementSize(container);
            source = _source;
            viewport = new Seadragon.Viewport(prevContainerSize, source.dimensions);
            drawer = new Seadragon.Drawer(source, viewport, canvas);
            profiler = new Seadragon.Profiler();
            self.source = source;
            self.viewport = viewport;
            self.drawer = drawer;
            self.profiler = profiler;
            animating = false;
            forceRedraw = true;
            scheduleUpdate(updateMulti);
            eventManager.trigger("open", self);
        }

        function onClose() {
            self.source = source = null;
            self.viewport = viewport = null;
            self.drawer = drawer = null;
            self.profiler = profiler = null;
            canvas.innerHTML = "";
        }

        function scheduleUpdate(updateFunc, prevUpdateTime) {
            if (animating) {
                return window.setTimeout(updateFunc, 1);
            }
            var currentTime = new Date().getTime();
            var prevUpdateTime = prevUpdateTime ? prevUpdateTime : currentTime;
            var targetTime = prevUpdateTime + 1000 / 60;
            var deltaTime = Math.max(1, targetTime - currentTime);
            return window.setTimeout(updateFunc, deltaTime);
        }

        function updateOnce() {
            if (!source) {
                return;
            }
            profiler.beginUpdate();
            var containerSize = Seadragon.Utils.getElementSize(container);
            if (!containerSize.equals(prevContainerSize)) {
                viewport.resize(containerSize, true);
                prevContainerSize = containerSize;
                eventManager.trigger("resize", self);
            }
            var animated = viewport.update();
            if (!animating && animated) {
                eventManager.trigger("animationstart", self);
                abortControlsAutoHide();
            }
            if (animated) {
                drawer.update();
                eventManager.trigger("animation", self);
            } else if (forceRedraw || drawer.needsUpdate()) {
                drawer.update();
                forceRedraw = false;
            } else {
                drawer.idle();
            }
            if (animating && !animated) {
                eventManager.trigger("animationfinish", self);
                if (!mouseInside) {
                    beginControlsAutoHide();
                }
            }
            animating = animated;
            profiler.endUpdate();
        }

        function updateMulti() {
            if (!source) {
                return;
            }
            var beginTime = new Date().getTime();
            updateOnce();
            scheduleUpdate(arguments.callee, beginTime);
        }

        function getControlIndex(elmt) {
            for (var i = controls.length - 1; i >= 0; i--) {
                if (controls[i].elmt == elmt) {
                    return i;
                }
            }
            return -1;
        }

        function scheduleControlsFade() {
            window.setTimeout(updateControlsFade, 20);
        }

        function updateControlsFade() {
            if (controlsShouldFade) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - controlsFadeBeginTime;
                var opacity = 1.0 - deltaTime / controlsFadeLength;
                opacity = Math.min(1.0, opacity);
                opacity = Math.max(0.0, opacity);
                for (var i = controls.length - 1; i >= 0; i--) {
                    controls[i].setOpacity(opacity);
                }
                if (opacity > 0) {
                    scheduleControlsFade();
                }
            }
        }

        function abortControlsAutoHide() {
            controlsShouldFade = false;
            for (var i = controls.length - 1; i >= 0; i--) {
                controls[i].setOpacity(1.0);
            }
        }

        function beginControlsAutoHide() {
            if (!Seadragon.Config.autoHideControls) {
                return;
            }
            controlsShouldFade = true;
            controlsFadeBeginTime = new Date().getTime() + controlsFadeDelay;
            window.setTimeout(scheduleControlsFade, controlsFadeDelay);
        }

        function onContainerEnter(tracker, position, buttonDownElmt, buttonDownAny) {
            mouseInside = true;
            abortControlsAutoHide();
        }

        function onContainerExit(tracker, position, buttonDownElmt, buttonDownAny) {
            if (!buttonDownElmt) {
                mouseInside = false;
                if (!animating) {
                    beginControlsAutoHide();
                }
            }
        }

        function onContainerRelease(tracker, position, insideElmtPress, insideElmtRelease) {
            if (!insideElmtRelease) {
                mouseInside = false;
                if (!animating) {
                    beginControlsAutoHide();
                }
            }
        }

        function onCanvasClick(tracker, position, quick, shift) {
            if (viewport && quick) {
                var zoomPerClick = Seadragon.Config.zoomPerClick;
                var factor = shift ? 1.0 / zoomPerClick : zoomPerClick;
                viewport.zoomBy(factor, viewport.pointFromPixel(position, true));
                viewport.applyConstraints();
            }
        }

        function onCanvasDrag(tracker, position, delta, shift) {
            if (viewport) {
                viewport.panBy(viewport.deltaPointsFromPixels(delta.negate()));
            }
        }

        function onCanvasRelease(tracker, position, insideElmtPress, insideElmtRelease) {
            if (insideElmtPress && viewport) {
                viewport.applyConstraints();
            }
        }

        function onCanvasScroll(tracker, position, delta, shift) {
            if (viewport) {
                var factor = Math.pow(Seadragon.Config.zoomPerScroll, delta);
                viewport.zoomBy(factor, viewport.pointFromPixel(position, true));
                viewport.applyConstraints();
            }
        }

        function onPageKeyDown(event) {
            event = Seadragon.Utils.getEvent(event);
            if (event.keyCode === 27) {
                self.setFullPage(false);
            }
        }
        this.isOpen = function () {
            return !!source;
        };
        this.openDzi = function (xmlUrl, xmlString) {
            var currentTime = beforeOpen();
            Seadragon.DziTileSource.createFromXml(xmlUrl, xmlString, Seadragon.Utils.createCallback(null, onOpen, currentTime));
        };
        this.openTileSource = function (tileSource) {
            var currentTime = beforeOpen();
            window.setTimeout(function () {
                onOpen(currentTime, tileSource);
            }, 1);
        };
        this.close = function () {
            if (!source) {
                return;
            }
            onClose();
        };
        this.addControl = function (elmt, anchor) {
            var elmt = Seadragon.Utils.getElement(elmt);
            if (getControlIndex(elmt) >= 0) {
                return;
            }
            var div = null;
            switch (anchor) {
            case Anchor.TOP_RIGHT:
                div = controlsTR;
                elmt.style.position = "relative";
                break;
            case Anchor.BOTTOM_RIGHT:
                div = controlsBR;
                elmt.style.position = "relative";
                break;
            case Anchor.BOTTOM_LEFT:
                div = controlsBL;
                elmt.style.position = "relative";
                break;
            case Anchor.TOP_LEFT:
                div = controlsTL;
                elmt.style.position = "relative";
                break;
            case Anchor.NONE:
            default:
                div = container;
                elmt.style.position = "absolute";
                break;
            }
            controls.push(new Control(elmt, anchor, div));
        };
        this.removeControl = function (elmt) {
            var elmt = Seadragon.Utils.getElement(elmt);
            var i = getControlIndex(elmt);
            if (i >= 0) {
                controls[i].destroy();
                controls.splice(i, 1);
            }
        };
        this.clearControls = function () {
            while (controls.length > 0) {
                controls.pop().destroy();
            }
        };
        this.getNavControl = function () {
            return navControl;
        };
        this.isDashboardEnabled = function () {
            for (var i = controls.length - 1; i >= 0; i--) {
                if (controls[i].isVisible()) {
                    return true;
                }
            }
            return false;
        };
        this.isFullPage = function () {
            return container.parentNode == document.body;
        };
        this.isMouseNavEnabled = function () {
            return innerTracker.isTracking();
        };
        this.isVisible = function () {
            return container.style.visibility != "hidden";
        };
        this.setDashboardEnabled = function (enabled) {
            for (var i = controls.length - 1; i >= 0; i--) {
                controls[i].setVisible(enabled);
            }
        };
        this.setFullPage = function (fullPage) {
            if (fullPage == self.isFullPage()) {
                return;
            }
            var body = document.body;
            var bodyStyle = body.style;
            var docStyle = document.documentElement.style;
            var containerStyle = container.style;
            var canvasStyle = canvas.style;
            if (fullPage) {
                bodyOverflow = bodyStyle.overflow;
                docOverflow = docStyle.overflow;
                bodyStyle.overflow = "hidden";
                docStyle.overflow = "hidden";
                bodyWidth = bodyStyle.width;
                bodyHeight = bodyStyle.height;
                bodyStyle.width = "100%";
                bodyStyle.height = "100%";
                canvasStyle.backgroundColor = "black";
                canvasStyle.color = "white";
                containerStyle.position = "fixed";
                containerStyle.zIndex = "99999999";
                body.appendChild(container);
                prevContainerSize = Seadragon.Utils.getWindowSize();
                Seadragon.Utils.addEvent(document, "keydown", onPageKeyDown);
                onContainerEnter();
            } else {
                bodyStyle.overflow = bodyOverflow;
                docStyle.overflow = docOverflow;
                bodyStyle.width = bodyWidth;
                bodyStyle.height = bodyHeight;
                canvasStyle.backgroundColor = "";
                canvasStyle.color = "";
                containerStyle.position = "relative";
                containerStyle.zIndex = "";
                parent.appendChild(container);
                prevContainerSize = Seadragon.Utils.getElementSize(parent);
                Seadragon.Utils.removeEvent(document, "keydown", onPageKeyDown);
                onContainerExit();
            }
            if (viewport) {
                var oldBounds = viewport.getBounds();
                viewport.resize(prevContainerSize);
                var newBounds = viewport.getBounds();
                if (fullPage) {
                    fsBoundsDelta = new Seadragon.Point(newBounds.width / oldBounds.width, newBounds.height / oldBounds.height);
                } else {
                    viewport.update();
                    viewport.zoomBy(Math.max(fsBoundsDelta.x, fsBoundsDelta.y), null, true);
                }
                forceRedraw = true;
                eventManager.trigger("resize", self);
                updateOnce();
            }
        };
        this.setMouseNavEnabled = function (enabled) {
            innerTracker.setTracking(enabled);
        };
        this.setVisible = function (visible) {
            container.style.visibility = visible ? "" : "hidden";
        };
        this.addEventListener = function (eventName, handler) {
            eventManager.addListener(eventName, handler);
        };
        this.removeEventListener = function (eventName, handler) {
            eventManager.removeListener(eventName, handler);
        };
        initialize();
    };
})();
Seadragon.Config.imagePath = "http://seadragon.com/ajax/0.8/img/";
(function () {
    if (typeof (Seadragon.BrandedViewer) == "function") {
        return;
    }
    Seadragon.Strings.setString("About.Header", "Welcome to Seadragon.");
    Seadragon.Strings.setString("About.Description", "Use your mouse and scroll wheel to pan and zoom around the image. " + "To get your own, visit:");
    Seadragon.Strings.setString("About.LogoUrl", "http://seadragon.com/");
    Seadragon.Strings.setString("About.MainUrl", "http://seadragon.com/create/");
    Seadragon.Strings.setString("Tooltips.AboutButton", "About Seadragon");
    var BRANDING_PATH = "../branding/";
    var SIGNAL = "----seadragon----";
    var LOGO_PREFIX = "about";
    var REST = "_rest.png";
    var GROUP = "_grouphover.png";
    var HOVER = "_hover.png";
    var DOWN = "_pressed.png";

    function logoUrl(postfix) {
        return Seadragon.Config.imagePath + BRANDING_PATH + LOGO_PREFIX + postfix;
    }

    function makeLogoControl(viewer) {
        var button = new Seadragon.Button(Seadragon.Strings.getString("Tooltips.AboutButton"), logoUrl(REST), logoUrl(GROUP), logoUrl(HOVER), logoUrl(DOWN), null, showInfo, null, null, null);
        var group = new Seadragon.ButtonGroup([button]);

        function showInfo() {
            viewer.setAboutScreenVisible(true);
        }

        function lightUp() {
            group.emulateEnter();
            group.emulateExit();
        }
        group.elmt[SIGNAL] = true;
        viewer.addEventListener("open", lightUp);
        var elmt = group.elmt;
        var caption = Seadragon.Utils.makeNeutralElement("span");
        elmt.appendChild(caption);
        return elmt;
    }
    var ABOUT_LOGO_SRC = "logo_big.png";
    var ABOUT_TEXT_WIDTH = 70;
    var ABOUT_TEXT_LEFT = 18;

    function preventClickClose(elmt) {
        Seadragon.Utils.addEvent(elmt, "mouseup", Seadragon.Utils.stopEvent);
        Seadragon.Utils.addEvent(elmt, "click", Seadragon.Utils.stopEvent);
    }

    function resetTextCss(elmt) {
        var elmtStyle = elmt.style;
        elmtStyle.color = "white";
        elmtStyle.fontFamily = "verdana";
        elmtStyle.fontSize = "13px";
        elmtStyle.fontSizeAdjust = "none";
        elmtStyle.fontStyle = "normal";
        elmtStyle.fontStretch = "normal";
        elmtStyle.fontVariant = "normal";
        elmtStyle.fontWeight = "normal";
        elmtStyle.lineHeight = "1em";
        elmtStyle.textAlign = "left";
        elmtStyle.textDecoration = "none";
    }

    function makeAboutScreen(viewer) {
        var info = Seadragon.Utils.makeNeutralElement("div");
        var tracker = new Seadragon.MouseTracker(info);
        info.style.position = "absolute";
        info.style.left = info.style.top = "0px";
        info.style.width = info.style.height = "100%";
        tracker.setTracking(true);
        tracker.clickHandler = function (tracker, position, quick, shift) {
            if (quick) {
                viewer.setAboutScreenVisible(false);
            }
        };
        var background = Seadragon.Utils.makeNeutralElement("div");
        var about = Seadragon.Utils.makeNeutralElement("div");
        var logo = Seadragon.Utils.makeNeutralElement("div");
        var footer = Seadragon.Utils.makeNeutralElement("div");
        background.style.position = logo.style.position = about.style.position = footer.style.position = "absolute";
        background.style.background = "black";
        background.style.left = background.style.top = "0px";
        background.style.width = background.style.height = "100%";
        Seadragon.Utils.setElementOpacity(background, 0.7);
        logo.style.left = "0px";
        logo.style.top = "20px";
        about.style.left = about.style.top = "0px";
        about.style.width = about.style.height = "100%";
        about.style.textAlign = "left";
        footer.style.right = "4px";
        footer.style.bottom = "8px";
        info.appendChild(background);
        info.appendChild(about);
        info.appendChild(logo);
        info.appendChild(footer);
        var aboutInner = Seadragon.Utils.makeNeutralElement("div");
        var aboutHeader = Seadragon.Utils.makeNeutralElement("p");
        var aboutDesc = Seadragon.Utils.makeNeutralElement("p");
        var aboutUrl = Seadragon.Utils.makeNeutralElement("p");
        var aboutLink = Seadragon.Utils.makeNeutralElement("a");
        aboutHeader.appendChild(document.createTextNode(Seadragon.Strings.getString("About.Header")));
        aboutDesc.appendChild(document.createTextNode(Seadragon.Strings.getString("About.Description")));
        aboutLink.appendChild(document.createTextNode(Seadragon.Strings.getString("About.MainUrl")));
        resetTextCss(aboutHeader);
        resetTextCss(aboutDesc);
        resetTextCss(aboutUrl);
        resetTextCss(aboutLink);
        aboutHeader.style.fontWeight = "bold";
        aboutHeader.style.paddingTop = "2em";
        aboutDesc.style.margin = "1em auto";
        aboutLink.href = Seadragon.Strings.getString("About.MainUrl");
        aboutLink.target = "_blank";
        aboutLink.style.color = "yellow";
        aboutLink.style.textDecoration = "none";
        preventClickClose(aboutLink);
        var aboutTextWidth = ABOUT_TEXT_WIDTH;
        var aboutTextLeft = ABOUT_TEXT_LEFT;
        if (Seadragon.Utils.getBrowser() == Seadragon.Browser.IE && Seadragon.Utils.getBrowserVersion() < 8) {
            aboutTextLeft -= (100 - aboutTextWidth) / 2;
        }
        aboutInner.style.width = aboutTextWidth + "%";
        aboutInner.style.marginLeft = aboutTextLeft + "%";
        aboutInner.style.textAlign = "left";
        aboutUrl.appendChild(aboutLink);
        aboutInner.appendChild(aboutHeader);
        aboutInner.appendChild(aboutDesc);
        aboutInner.appendChild(aboutUrl);
        about.appendChild(Seadragon.Utils.makeCenteredNode(aboutInner));
        var logoLink = Seadragon.Utils.makeNeutralElement("a");
        var logoImage = Seadragon.Utils.makeTransparentImage(Seadragon.Config.imagePath + BRANDING_PATH + ABOUT_LOGO_SRC);
        logoLink.href = Seadragon.Strings.getString("About.LogoUrl");
        logoLink.target = "_blank";
        preventClickClose(logoLink);
        logoLink.appendChild(logoImage);
        logo.appendChild(logoLink);
        return info;
    }
    Seadragon.BrandedViewer = function (container) {
        var self = new Seadragon.Viewer(container);
        var logoControl = makeLogoControl(self);
        var aboutScreen = makeAboutScreen(self);
        var introAnimating = false;

        function init() {
            self.addControl(logoControl, Seadragon.ControlAnchor.BOTTOM_LEFT);
            logoControl.style.marginLeft = "4px";
            logoControl.style.marginBottom = "4px";
            self.addEventListener("open", introAnimationSetup);
        }

        function introAnimationSetup() {
            var viewport = self.viewport;
            var homeZoom = viewport.getZoom();
            introAnimating = true;
            //viewport.zoomBy(0.01, null, true);
			viewport.zoomBy(1, null, true);
            viewport.update();
            window.setTimeout(function () {
                if (viewport !== self.viewport) {
                    return;
                }
                //viewport.zoomTo(1.15 * homeZoom);
				viewport.zoomTo(2);
                window.setTimeout(function () {
                    if (introAnimating && viewport === self.viewport) {
                        //origViewportZoomTo(homeZoom);
						origViewportZoomTo(1);
                    }
                }, Seadragon.Config.animationTime * 1000 / 2);
                var origViewportZoomTo = wrapViewportMethod(viewport, "zoomTo");
                self.addEventListener("animationfinish", onAnimationFinish);
            }, 50);
        }

        function wrapViewportMethod(viewport, methodName) {
            var origFunc = viewport[methodName];
            viewport[methodName] = function () {
                introAnimating = false;
                origFunc.apply(viewport, arguments);
                viewport[methodName] = origFunc;
            };
            return origFunc;
        }

        function onAnimationFinish(viewer) {
            introAnimating = false;
            viewer.removeEventListener("animationfinish", arguments.callee);
        }
        init();
        self.getLogoControl = function () {
            return logoControl;
        };
        self.getAboutScreen = function () {
            return aboutScreen;
        };
        self.isAboutScreenVisible = function () {
            return aboutScreen.parentNode == self.elmt;
        };
        self.isIntroAnimating = function () {
            return introAnimating;
        };
        self.setAboutScreenVisible = function (visible) {
            if (visible == self.isAboutScreenVisible()) {
                return;
            }
            if (visible) {
                self.elmt.appendChild(aboutScreen);
            } else {
                self.elmt.removeChild(aboutScreen);
            }
        };
        self.addAboutFooterLink = function (url, text) {
            var footer = aboutScreen.lastChild;
            var footerLink = Seadragon.Utils.makeNeutralElement("a");
            resetTextCss(footerLink);
            preventClickClose(footerLink);
            footerLink.href = url;
            footerLink.target = "_blank";
            footerLink.appendChild(document.createTextNode(text || url));
            footerLink.style.color = "yellow";
            footerLink.style.textDecoration = "none";
            if (footer.firstChild) {
                var divider = Seadragon.Utils.makeNeutralElement("span");
                resetTextCss(divider);
                divider.style.color = "gray";
                divider.appendChild(document.createTextNode(" | "));
                footer.appendChild(divider);
            }
            footer.appendChild(footerLink);
        };
        self.setLogoCaption = function (text, url) {
            var caption = logoControl.lastChild;
            var elmt = Seadragon.Utils.makeNeutralElement(url ? "a" : "span");
            var elmtStyle = elmt.style;
            resetTextCss(elmt);
            elmtStyle.color = "#ccc";
            elmtStyle.fontSize = "10px";
            elmtStyle.position = "relative";
            elmtStyle.bottom = "8px";
            elmtStyle.left = "4px";
            elmt.appendChild(document.createTextNode(text));
            if (url) {
                elmt.href = url;
                elmt.target = "_blank";
                elmtStyle.color = "#cc0";
            }
            caption.innerHTML = "";
            caption.appendChild(elmt);
        };
        return self;
    };
})();