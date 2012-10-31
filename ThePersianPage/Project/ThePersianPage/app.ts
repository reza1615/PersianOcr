/// <reference path="jquery.d.ts" />
declare var html2canvas;
declare var $;
var zwnj = '\u200c';
var alefba = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیؤئيك';
var harekat = 'ًٌٍَُِّْٔ';
var notJoinableToNext = 'ةآأإادذرزژو';
function isAlefba(char: string) {
    return alefba.indexOf(char) !== -1;
}
function isJoinableToNext(char: string) {
    return notJoinableToNext.indexOf(char) === -1 && isAlefba(char);
}
function isHarekat(char: string) {
    return harekat.indexOf(char) !== -1;
}

class SamplePage {
    page: JQuery;

    constructor (page: JQuery) {
        this.page = page;
    }

    insert(input: string) {
        var chars = input;
        var sb = [];
        var id = 0;
        var nextMustJoined = false;
        sb.push('<p>');
        for (var i = 0; i < chars.length; i++) {
            var char = chars[i];
            var nextChar = chars[i + 1];

            if (char === '\n') {
                sb.push('</p><p>');
            } else if (char === ' ' || char === zwnj) {
                sb.push(char);
            } else {
                sb.push('<span class="char">');
                sb.push(char);
                while (true) {
                    if ((isHarekat(nextChar)) || (isJoinableToNext(char) && isAlefba(nextChar))) {
                        sb.push(nextChar);
                        i++;
                        char = chars[i];
                        nextChar = chars[i + 1];
                    } else {
                        break;
                    }
                }
                sb.push('</span>');

            }
        }
        sb.push('</p>');
        var section = sb.join('');

        var html = '<div>' + section + '</div>';
        this.page.html(html);
        this.page[0].style.fontSize = $('#fontSize').val() + 'px';

        var elements = $('.char', this.page).toArray();
        var sb = [];

        var ptop = this.page[0].offsetTop;
        var pleft = this.page[0].offsetLeft;
        var pheight = this.page[0].offsetHeight;
        var pwidth = this.page[0].offsetWidth;

        var scale = $('#scale').val();

        var huge = (<HTMLInputElement>$('#huge')[0]).checked;

        if (!huge) {
            var canvas = <HTMLCanvasElement>document.getElementById('canvas');
            canvas.height = pheight * scale;
            canvas.width = pwidth * scale;
            var context = canvas.getContext('2d');

            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.textBaseline = 'bottom';
            context.fillStyle = 'black';
        }
        var fontpx = parseInt(getComputedStyle(elements[0]).getPropertyValue('font-size')) * scale;
        var pageClasses = this.page[0].getAttribute('class');
        if (!huge) {
            context.font = $('#style').val() + ' ' + fontpx + 'px ' + $('#font').val();
        }

        var ishift = parseInt($('#ishift').val());
        var iishift = parseInt($('#iishift').val());
        var iiishift = parseInt($('#iiishift').val());
        var ivshift = parseInt($('#ivshift').val());

        for (var i in elements) {
            var el = <HTMLElement>elements[i];
            var elcontent = el.innerHTML;
            sb.push(elcontent);
            sb.push(' ');

            var left = el.offsetLeft - pleft;
            var top = el.offsetTop - ptop;
            var height = el.offsetHeight;
            var width = el.offsetWidth;

            sb.push((left * scale) + ishift);
            sb.push(' ');
            sb.push(((pheight - (top + height)) * scale) + iishift);
            sb.push(' ');
            sb.push(((left + width) * scale) + iiishift);
            sb.push(' ');
            sb.push(((pheight - top) * scale) + ivshift);
            sb.push(' 0');
            sb.push('\n');

            if (!huge) {
                context.fillText(elcontent, (left + width) * scale, (top + height) * scale);
            }
        }
        if (!huge) {
            context.save();
        }
        var boxes = sb.join('');
        $('#boxes').val(boxes);

        var fontFileName = $('#font').val() + $('#style').val().replace(" ", "");
        if (!huge) {
            var pngDownload = document.getElementById('downloadPNG');
            pngDownload.setAttribute('download', "per." + fontFileName + ".exp0.png");
            pngDownload.setAttribute('href', canvas.toDataURL("image/png"));

            var boxDownload = document.getElementById('downloadBOX');
            boxDownload.setAttribute('download', "per." + fontFileName + ".exp0.box");
            boxDownload.setAttribute('href', 'data:text/plain;charset=utf-8,' + boxes.replace(/\n/g, "%0A"));
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    $('#button').click(() => {
        var t = $('textarea#inputText');
        var p = $('div#page');

        p.removeClass('nazli arial tahoma').addClass($('#font').val());
        p.removeClass('bold italic').addClass($('#style').val());

        var page = new SamplePage(p);
        page.insert(t.val());
    }).click();
});
