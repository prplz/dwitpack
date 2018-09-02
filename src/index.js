import './index.scss';

const $ = document.querySelector.bind(document);

function onInput() {
    const source = $('#input').value;
    let output = source.replace(/../g, s => String.fromCharCode(s.charCodeAt(0) * 256 + s.charCodeAt(1)));
    if (output.charAt(output.length - 1) === '`') {
        output = output.substr(0, output.length - 1) + '\\`';
    }
    output = 'eval(unescape(escape`' + output + '`.replace(/u(..)/g,"$1%")))';
    $('#output').textContent = output;
    $('#output-count').textContent = `${output.length} chars`;
    $('#input-count').textContent = `${source.length} chars`;
}

$('#input').addEventListener('input', onInput);

onInput();