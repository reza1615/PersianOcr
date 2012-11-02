var zwnj = '\u200c';
var alefba = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیؤئيك';
var harekat = 'ًٌٍَُِّْٔ';
var notJoinableToNext = 'ةآأإادذرزژو';
var zwj = '\u200d';
function isAlefba(char) {
    return alefba.indexOf(char) !== -1;
}
function isJoinableToNext(char) {
    return notJoinableToNext.indexOf(char) === -1 && isAlefba(char);
}
function isHarekat(char) {
    return harekat.indexOf(char) !== -1;
}
var Main = (function () {
    function Main() { }
    Main.prototype.insert = function (input, pageId) {
        var page = $('#page');
        var chars = input;
        var parts = {
        };
        var sb = [];
        var id = 0;
        var nextMustJoined = false;
        sb.push('<p>');
        for(var i = 0; i < chars.length; i++) {
            var char = chars[i];
            var nextChar = chars[i + 1];
            if(char === '\n') {
                sb.push('</p><p>');
            } else {
                if(char === ' ' || char === zwnj) {
                    sb.push(char);
                } else {
                    var isb = [];
                    id++;
                    isb.push('<span class="char" uid="' + id + '">');
                    isb.push(char);
                    parts[id] = char;
                    while(true) {
                        if((isHarekat(nextChar)) || (isJoinableToNext(char) && isAlefba(nextChar))) {
                            isb.push(nextChar);
                            parts[id] = parts[id] + nextChar;
                            i++;
                            char = chars[i];
                            nextChar = chars[i + 1];
                        } else {
                            break;
                        }
                    }
                    isb.push('</span>');
                    sb.push(isb.join(''));
                }
            }
        }
        sb.push('</p>');
        var section = sb.join('');
        var html = '<div>' + section + '</div>';
        page.html(html);
        $('.char').css('margin-left', $('#letterSpacing').val() + 'px');
        page.css('line-height', $('#lineHeight').val());
        var direction = (document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        page.css('direction', direction);
        $('#page').css('direction', direction);
        $('#canvasWrapper').css('direction', direction);
        page[0].style.fontSize = $('#fontSize').val() + 'px';
        var elements = $('.char', page).toArray();
        var sb = [];
        var ptop = page[0].offsetTop;
        var pleft = page[0].offsetLeft;
        var pheight = page[0].offsetHeight;
        var pwidth = page[0].offsetWidth;
        var canvas = document.getElementById('canvas');
        canvas.height = pheight;
        canvas.width = pwidth;
        var context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textBaseline = 'bottom';
        context.fillStyle = 'black';
        var fontpx = parseInt(getComputedStyle(elements[0]).getPropertyValue('font-size'));
        var pageClasses = page.attr('class');
        context.font = $('#style').val() + ' ' + fontpx + 'px ' + $('#font').val();
        var ishift = parseInt($('#ishift').val());
        var iishift = parseInt($('#iishift').val());
        var iiishift = parseInt($('#iiishift').val());
        var ivshift = parseInt($('#ivshift').val());
        for(var i in elements) {
            var el = elements[i];
            var elcontent = parts[el.getAttribute('uid')];
            sb.push(elcontent);
            sb.push(' ');
            var left = el.offsetLeft - pleft;
            var top = el.offsetTop - ptop;
            var height = el.offsetHeight;
            var width = el.offsetWidth;
            sb.push(left + ishift);
            sb.push(' ');
            sb.push(pheight - (top + height) + iishift);
            sb.push(' ');
            sb.push(left + width + iiishift);
            sb.push(' ');
            sb.push(pheight - top + ivshift);
            sb.push(' ');
            sb.push(pageId);
            sb.push('\n');
            var lleft = direction === 'ltr' ? left : left + width;
            context.fillText(elcontent, lleft, (top + height));
        }
        context.save();
        var boxes = sb.join('');
        boxes = boxes.replace(/\u200d/g, "");
        $('#boxes').val(boxes);
        var lang = $('#languageCode').val();
        var fontFileName = $('#font').val() + $('#style').val().replace(" ", "");
        var pngData = canvas.toDataURL("image/png");
        pngData = pngData.replace('data:image/png;base64,', '');
        $.ajax('api/uploadbinary/' + pageId + '.' + lang + '.' + fontFileName + '.exp0.png', {
            type: 'POST',
            data: pngData,
            dataType: 'text'
        });
        $.ajax('api/uploadtext/' + pageId + '.' + lang + '.' + fontFileName + '.exp0.box', {
            type: 'POST',
            data: boxes,
            dataType: 'text'
        });
    };
    return Main;
})();
document.addEventListener('DOMContentLoaded', function () {
    $('#button').click(function () {
        $('#page').removeClass('bold italic').addClass($('#style').val());
        var main = new Main();
        var splitter = ' ';
        var parts = $('#inputText').val().split(' ');
        var limit = $("#limit").val() * 1000;
        var page = [];
        var size = 0;
        var pageId = 0;
        var results = [];
        for(var i = 0; i < parts.length; i++) {
            console.log(size, limit, i);
            if(size <= limit) {
                page.push(parts[i]);
                size = size + parts[i].length;
            }
            if(size > limit || (i + 1 === parts.length && size !== 0)) {
                main.insert(page.join(' '), pageId);
                pageId++;
                page = [];
                size = 0;
            }
        }
    }).click();
    $('#rtlMode').change(function () {
        var direction = (document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        $('#inputText').css('direction', direction);
    }).change();
});
