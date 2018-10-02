import 'normalize.css/normalize.css';
import './index.css';

const $ = document.querySelector.bind(document);

const Mode = {
    UNICODE_2: 'unicode-2',
    UNICODE_3: 'unicode-3'
};

let mode = Mode.UNICODE_2;

function onInput() {
    const input = $('#input').value;
    $('#input-count').textContent = `${[...input].length} chars`;

    try {
        let output;
        const decompressMatch = input.match(/eval\((unescape\(escape`.*\))\)/);
        if (decompressMatch) {
            output = eval(decompressMatch[1]);
        } else if (mode === Mode.UNICODE_2) {
            output = compressUnicode2(input);
        } else if (mode === Mode.UNICODE_3) {
            output = compressUnicode3(input);
        }
        $('#output').textContent = output;
        $('#output-count').textContent = `${[...output].length} chars`;
    } catch (e) {
        $('#output').textContent = `Error: ${e}`;
        $('#output-count').textContent = '';
    }
}

function setMode(newMode) {
    mode = newMode;
    onInput();
}

// http://xem.github.io/golfing/#jstweet_en
function compressUnicode2(input) {
    for (const char of input) {
        if (char.charCodeAt(0) > 255) {
            throw 'Input must contain only characters 0-255';
        }
    }
    // pad with a space to get an even length
    if (input.length % 2 === 1) {
        input += ' ';
    }
    let output = '';
    for (let i = 0; i < input.length; i += 2) {
        output += String.fromCharCode(0xD800 + input.charCodeAt(i));
        output += String.fromCharCode(0xDC00 + input.charCodeAt(i + 1));
    }
    if (unescape(escape(output).replace(/uD./g, '')) !== input) {
        throw 'Failed to compress';
    }
    return `eval(unescape(escape\`${output}\`.replace(/uD./g,'')))`;
}

// http://www.romancortes.com/v2/javascript-code-golf.html
function compressUnicode3(input) {
    for (const char of input) {
        const charCode = char.charCodeAt(0);
        if (charCode < 32 || charCode > 127) {
            throw 'Input must contain only characters 32-127';
        }
    }
    // must start with a semicolon
    if (!input.startsWith(';')) {
        input = ';' + input;
    }
    // pad with spaces to get a length which is a multiple of 3
    while (input.length % 3 !== 0) {
        input += ' ';
    }
    let output = '';
    for (let i = 0; i < input.length; i += 3) {
        output += String.fromCodePoint(input.charCodeAt(i) - 31 +
            (input.charCodeAt(i + 1) - 31) * 97 +
            (input.charCodeAt(i + 2) - 31) * 97 * 97);
    }
    let test = '';
    for (const c of output) {
        for (let v = c.codePointAt(0); v | 0; v /= 97) {
            test += String.fromCharCode(v % 97 + 31);
        }
    }
    if (test !== input) {
        throw 'Failed to compress';
    }
    return `_=0;for(c of'${output}')for(v=c.codePointAt();v|0;v/=97)_+=String.fromCharCode(v%97+31);eval(_)`;
}

$('#input').addEventListener('input', onInput);

$('#mode-unicode-2').addEventListener('change', () => setMode(Mode.UNICODE_2));
$('#mode-unicode-3').addEventListener('change', () => setMode(Mode.UNICODE_3));

onInput();