import 'normalize.css/normalize.css';
import './index.css';

const $ = document.querySelector.bind(document);

function onInput() {
    const source = $('#input').value;
    $('#input-count').textContent = `${source.length} chars`;

    try {
        let output;
        const decompressMatch = source.match(/eval\((unescape\(escape`.*\))\)/);
        if (decompressMatch) {
            output = eval(decompressMatch[1]);
        } else {
            output = compress(source);
        }
        $('#output').textContent = output;
        $('#output-count').textContent = `${output.length} chars`;
    } catch (e) {
        $('#output').textContent = `Error: ${e}`;
        $('#output-count').textContent = '';
    }
}

function compress(input) {
    for (const char of input) {
        if (char.charCodeAt(0) > 255) {
            throw "Input must contain only ascii characters";
        }
    }
    const pattern = /[\s\S]{2}/g; // matches any two characters, including newlines
    let output = input.replace(pattern, s => String.fromCharCode(s.charCodeAt(0) * 256 + s.charCodeAt(1)));
    if (output.charAt(output.length - 1) === '`') {
        output = output.substr(0, output.length - 1) + '\\`';
    }
    return 'eval(unescape(escape`' + output + '`.replace(/u(..)/g,"$1%")))';
}

$('#input').addEventListener('input', onInput);

onInput();