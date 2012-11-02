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
var SamplePage = (function () {
    function SamplePage(page) {
        this.page = page;
    }
    SamplePage.prototype.insert = function (input) {
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
        this.page.html(html);
        $('.char').css('margin-left', $('#letterSpacing').val() + 'px');
        this.page.css('line-height', $('#lineHeight').val());
        var direction = (document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        this.page.css('direction', direction);
        $('#canvasWrapper').css('direction', direction);
        this.page[0].style.fontSize = $('#fontSize').val() + 'px';
        var elements = $('.char', this.page).toArray();
        var sb = [];
        var ptop = this.page[0].offsetTop;
        var pleft = this.page[0].offsetLeft;
        var pheight = this.page[0].offsetHeight;
        var pwidth = this.page[0].offsetWidth;
        var canvas = document.getElementById('canvas');
        canvas.height = pheight;
        canvas.width = pwidth;
        var context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.textBaseline = 'bottom';
        context.fillStyle = 'black';
        var fontpx = parseInt(getComputedStyle(elements[0]).getPropertyValue('font-size'));
        var pageClasses = this.page[0].getAttribute('class');
        context.font = $('#style').val() + ' ' + fontpx + 'px ' + $('#font').val();
        var ishift = parseInt($('#ishift').val());
        var iishift = parseInt($('#iishift').val());
        var iiishift = parseInt($('#iiishift').val());
        var ivshift = parseInt($('#ivshift').val());
        var pageNum = parseInt($('#pageNum').val());
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
            sb.push(pageNum);
            sb.push('\n');
            var lleft = direction === 'ltr' ? left : left + width;
            context.fillText(elcontent, lleft, (top + height));
        }
        context.save();
        var boxes = sb.join('');
        boxes = boxes.replace(/\u200d/g, "");
        $('#boxes').val(boxes);
        var fontFileName = $('#font').val() + $('#style').val().replace(" ", "");
        var pngData = canvas.toDataURL("image/png");
        pngData = pngData.replace('data:image/png;base64,', '');
        $.ajax('api/uploadbinary/' + 'LANG.' + fontFileName + '.exp0.png', {
            type: 'POST',
            data: pngData,
            dataType: 'text'
        });
        var boxDownload = document.getElementById('downloadBOX');
        $.ajax('api/uploadtext/' + 'LANG.' + fontFileName + '.exp0.box', {
            type: 'POST',
            data: boxes,
            dataType: 'text'
        });
    };
    return SamplePage;
})();
document.addEventListener('DOMContentLoaded', function () {
    $('#button').click(function () {
        var t = $('textarea#inputText');
        var p = $('div#page');
        p.removeClass('nazli arial tahoma').addClass($('#font').val());
        p.removeClass('bold italic').addClass($('#style').val());
        var page = new SamplePage(p);
        page.insert(t.val());
    }).click();
    $('#rtlMode').change(function () {
        var direction = (document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        $('#inputText').css('direction', direction);
    }).change();
});
