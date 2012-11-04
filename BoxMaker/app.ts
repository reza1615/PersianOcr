/// <reference path="jquery.d.ts" />
var zwnj = '\u200c';
var alefba = 'آاأإةبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهؤئكيىی';
var harekat = 'ًٌٍَُِّْٔ';
var notJoinableToNext = 'ةآأإادذرزژوؤ';
var zwj = '\u200d';
function isAlefba(char: string) {
    return alefba.indexOf(char) !== -1;
}
function isJoinableToNext(char: string) {
    return notJoinableToNext.indexOf(char) === -1 && isAlefba(char);
}
function isHarekat(char: string) {
    return harekat.indexOf(char) !== -1;
}

// http://stackoverflow.com/a/2998874
function zeroPad(num: number, places: number) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

class Main {
    insert(input: string, pageId: number) {
        var page = document.getElementById('page');
        var chars = input;
        var parts = {};
        var sb = [];
        var id = 0;
        var nextMustJoined = false;

        $('head').append('<style>.char { margin: 0 ' + $('#letterSpacing').val() + 'px; }</style>');
        page.style.lineHeight = $('#lineHeight').val();
        page.style.fontSize = $('#fontSize').val() + 'px';

        var direction = (<HTMLInputElement>document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        page.style.direction = direction;
        document.getElementById('canvasWrapper').style.direction = direction;

        sb.push('<p>');
        for (var i = 0; i < chars.length; i++) {
            var char = chars[i];
            var nextChar = chars[i + 1];

            if (char === '\n') {
                sb.push('</p><p>');
            } else if (char === ' ' || char === zwnj) {
                sb.push(char);
            } else {
                var isb = [];
                id++;
                isb.push('<span class="char" uid="' + id + '">');
                isb.push(char);
                parts[id] = char;
                while (true) {
                    if ((isHarekat(nextChar)) || (isJoinableToNext(char) && isAlefba(nextChar))) {
                        /*if (letterByLetter && !isHarekat(nextChar)) {
                            isb.push(zwj);
                            isb.push('</span>');
                            parts[id] = parts[id] + zwj;

                            id++;
                            isb.push('<span class="char" uid="' + id + '">');
                            isb.push(zwj);
                            parts[id] = zwj;
                        } */
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
        sb.push('</p><br />');
        var section = sb.join('');

        var html = '<div>' + section + '</div>';
        $(page).html(html);

        var elements = $('.char', page).toArray();
        var sb = [];

        var ptop = page.offsetTop;
        var pleft = page.offsetLeft;
        var pheight = page.offsetHeight;
        var pwidth = page.offsetWidth;

        var canvas = <HTMLCanvasElement>document.getElementById('canvas');
        canvas.height = pheight;
        canvas.width = pwidth;
        var context = canvas.getContext('2d');

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.textBaseline = 'bottom';
        context.fillStyle = 'black';
        var fontpx = parseInt(getComputedStyle(elements[0]).getPropertyValue('font-size'));
        var pageClasses = page.getAttribute('class');
        context.font = $('#style').val() + ' ' + fontpx + 'px ' + $('#font').val();

        var ishift = parseInt($('#ishift').val());
        var iishift = parseInt($('#iishift').val());
        var iiishift = parseInt($('#iiishift').val());
        var ivshift = parseInt($('#ivshift').val());

        for (var i in elements) {
            var el = <HTMLElement>elements[i];
            var elcontent = parts[el.getAttribute('uid')];
            // HACK!
            if (elcontent.indexOf('�') !== -1)
                break;

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

        var pidStr = zeroPad(pageId, 2);
        $.ajax('api/uploadbinary/' + pidStr + '.' + lang + '.' + fontFileName + '.exp0.png', {
            type: 'POST',
            data: pngData,
            dataType: 'text'
        });

        $.ajax('api/uploadtext/' + pidStr + '.box', {
            type: 'POST',
            data: boxes,
            dataType: 'text'
        });

        $.ajax('api/uploadtext/' + pidStr + '.txt', {
            type: 'POST',
            data: input,
            dataType: 'text'
        });
    }

}

document.addEventListener('DOMContentLoaded', () => {
    $('#button').click(() => {
        $('#page').removeClass('bold italic').addClass($('#style').val());

        var main = new Main();

        var splitter = ' ';
        var parts: string[] = $('#inputText').val().split(' ');
        var limit: number = $("#limit").val() * 1000;

        var page: string[] = [];
        var size: number = 0;
        var pageId: number = 0;

        var results = [];
        for (var i = 0; i < parts.length; i++) {
            if (size <= limit) {
                page.push(parts[i]);
                size = size + parts[i].length + 1;
            }
            if (size > limit || (i + 1 === parts.length && size !== 0)) {
                main.insert(page.join(' '), pageId);
                pageId++;
                page = [];
                size = 0;
            }
        }
    }).click();

    $('#rtlMode').change(() => {
        var direction = (<HTMLInputElement>document.getElementById('rtlMode')).checked ? 'rtl' : 'ltr';
        $('#inputText').css('direction', direction);
    }).change();
});
