function logError(element, err) {
    console.log(element + ' : ' + err);
}

function formDataToObject(formData) {
    const jsonObject = {};
    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }
    return jsonObject;
}

function relayConfig() {
    const formData = new FormData(document.forms['config']);
    const jsonObject = formDataToObject(formData);
    const jsonString = JSON.stringify(jsonObject);
    console.log(jsonString);
    window.cefQuery({
        request: jsonString,
        onSuccess: function (response) {
        },
        onFailure: function (error_code, error_message) {
        }
    });
}

function configFilterWithPresets(element) {
    if (element.getAttribute("data-move")) {
        var moverPartner = document.forms['config'].elements[element.getAttribute("data-partner")];
        if (moverPartner != null) {
            var markerElement = document.getElementById(element.getAttribute("data-move"));
            if (markerElement != null) {
                markerElement.setAttribute(element.getAttribute("data-position"), element.value);
                markerElement.setAttribute(moverPartner.getAttribute("data-position"), moverPartner.value);
            }
        }
    }
    var elements = document.forms['config'].elements;
    var dataJoin = null;
    var dataLeft = null;
    var dataRight = null;
    for (var i = 0, element; element = elements[i++]; ) {
        if (element.getAttribute("data-partner") != null && element.getAttribute("data-position") != null && element.getAttribute("data-join") != null) {
            if (element.getAttribute("data-position") == 'left') {
                dataLeft = element;
            } else if (element.getAttribute("data-position") == 'right') {
                dataRight = element;
            }
            if (element.getAttribute("data-join")) {
                dataJoin = document.forms[0].elements[element.getAttribute("data-join")];
            }
        }
    }
    if (dataLeft != null && dataRight != null && dataJoin != null) {
        dataJoin.value = dataLeft.value + ' ' + dataRight.value;
    }
    for (var i = 0, element; element = elements[i++]; ) {
        if (element.getAttribute("type") == 'number' || (element.getAttribute("type") == 'radio' && element.checked) || element.getAttribute("type") == 'hidden') {
            var svgEl = document.getElementById(element.getAttribute('data-element'));
            if (svgEl != null) {
                svgEl.setAttribute(element.getAttribute('data-attr'), element.value);
            }
        }
    }
}

function populateSVG(content) {
    console.log('populateSVG fuck : ************************');
    var quoteContent = content.replaceAll('\'', '\"');
    console.log('quoteContent : ' + quoteContent);
    var svgContainer = document.getElementById('svgContainer');
    console.log('SVG 1');
    console.log('svgContainer : ' + svgContainer);
    console.log('SVG 2');
    if (svgContainer) {
        console.log('svgContainer : ' + svgContainer);
        svgContainer.innerHTML = quoteContent;
        draw = SVG().addTo('#svgContainer');
    }
}

function populateHTML(content) {
    console.log('populateHTML fuck : ************************');
    var quoteContent = content.replaceAll('\'', '\"');
    console.log('quoteContent : ' + quoteContent);
    var htmlContainer = document.getElementById('htmlContainer');
    console.log('HTML 1');
    console.log('htmlContainer : ' + htmlContainer);
    console.log('HTML 2');
    if (htmlContainer) {
        console.log('htmlContainer : ' + htmlContainer);
        htmlContainer.innerHTML = quoteContent;
    }
}

function scrollSVG(x, y) {
    var svgContainer = document.getElementById("svgContainer");
    svgContainer.scrollLeft = x;
    svgContainer.scrollTop = y;
}

function getMousePositionSVG(event) {
    var point = this.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(this.getScreenCTM().inverse());
    SVG('#' + xyMarker).move(point.x - 5, point.y - 5);
    return point;
}

function attachMouseFollower(element) {
    if (element.getAttribute("data-move")) {
        currentMarker = element.getAttribute("data-move");
    }
    // SVG ELEMENTS
    xyElement = element.getAttribute('data-element');
    xAttr = element.getAttribute('data-attrx');
    yAttr = element.getAttribute('data-attry');
    xyMarker = element.getAttribute('data-xymarker');
    // HTML ELEMENTS
    xyName = element.getAttribute('name');
    xName = element.getAttribute('data-x');
    yName = element.getAttribute('data-y');
    var svg = document.getElementsByTagName('svg')[0];
    if (element.checked) {
        svg.addEventListener('mousemove', getMousePositionSVG);
        svg.addEventListener('mousedown', getMouseClick);
    } else {
        svg.removeEventListener('mousemove', getMousePositionSVG);
        svg.removeEventListener('mousedown', getMouseClick);
    }
}

function getMouseClick(event) {
    var currentMarkerElement = document.getElementById(currentMarker);
    currentMarkerElement.setAttribute('cx', event.clientX - 10);
    currentMarkerElement.setAttribute('cy', event.clientY - 10);
    currentMarker = '';
    var element = document.getElementById(xyElement);
    element.setAttribute(xAttr, event.clientX - 10);
    element.setAttribute(yAttr, event.clientY - 10);
    document.forms[0].elements[xyName].checked = false;
    document.forms[0].elements[xName].value = event.clientX - 10;
    document.forms[0].elements[yName].value = event.clientY - 10;
    SVG('#' + xyMarker).move(-10, -10);
    xyMarker = '';
    xyElement = '';
    xAttr = '';
    yAttr = '';
    xName = '';
    yName = '';
    var svg = document.getElementsByTagName('svg')[0];
    svg.removeEventListener('mousemove', getMousePositionSVG);
    svg.removeEventListener('mousedown', getMouseClick);
}

function toggleColorPicker(button) {
    var x = document.getElementById('color-picker');
    const table = document.getElementsByClassName('propsTable')[0];
    if (x.style.display === 'none') {
        x.style.display = 'block';
        button.value = 'Hide';
        for (var i = 2, row; row = table.rows[i]; i++) {
            console.log('none : ' + i);
            row.style.display = 'none';
        }
    } else {
        x.style.display = 'none';
        button.value = 'Show';
        for (var i = 2, row; row = table.rows[i]; i++) {
            row.style.display = '';
        }
    }
}

function alertSgv() {
    var svgContainer = document.getElementById('svgContainer');
    alert(svgContainer.innerHTML);
}

function alertHtml() {
    var htmlContainer = document.getElementById('htmlContainer');
    alert(htmlContainer.innerHTML);
}

function initAnimateSvgFilter(aniType, elementId, attribute, name, value, duration) {
    var format = '';
    var val = -1;
    if (aniType == 'motion') {
        var stdXDeviation = document.getElementById('stdXDeviation').value;
        var stdYDeviation = document.getElementById('stdYDeviation').value;
        if (stdXDeviation == '0') {
            val = stdYDeviation;
            format = '0,R';
        } else {
            val = stdXDeviation;
            format = 'R,0';
        }
    }
    var fromValue = aniType == 'motion' ? val : document.getElementById(name).value;
    animateSvgFilter(elementId, attribute, duration, parseFloat(fromValue), parseFloat(value), format);
}

function animateSvgFilter(elementId, attribute, duration, fromValue, toValue, format) {
    if (format != '') {
        console.log('FORMAT');
    }
    var filterEl = document.getElementById(elementId);
    var dif = Math.abs(fromValue - toValue);
    var toGreater = toValue > fromValue ? true : false;
    try {
        var aniElement = SVG('#aniElement');
        var timeline = new SVG.Timeline();
        aniElement.timeline(timeline).animate(parseInt(duration), 100, 'absolute').ease('<>').during(function (eased) {
            var delta = parseFloat(dif) * parseFloat(eased);
            var value = toGreater ? fromValue + delta : fromValue - delta;
            if (format != '') {
                var dir = format.replace('R', value);
                filterEl.setAttribute(attribute, dir);
            } else {
                filterEl.setAttribute(attribute, value);
            }
            if (eased == 1) {
                console.log('Change Dir : ' + eased);
            }
        }).after(function () {
            aniElement.timeline().reverse(true)
        });
    } catch (err) {
        logError('aniElement', err.message);
    }
}

function clearPartner(element) {
    var partner = element.getAttribute('data-partner');
    var resetValue = element.getAttribute('data-resetValue');
    document.forms[0].elements[partner].value = resetValue;
}

function lightOrDark(color) {
    if (color.match(/^rgb/)) {
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color[1];
        g = color[2];
        b = color[3];
    } else {
        color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    if (hsp > 127.5) {
        return '#0178af';
    } else {
        return '#ffffff';
    }
}

function LightenDarkenColor(col, amt) {
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
}

function onLoad() {
    var html = "<table><tr><td style='color:red;'>RED</td><td style='color:green;'>GREEN</td><td style='color:blue;'>BLUE</td></tr></table>";
    populateSVG(html);
    populateHTML(html);
}            