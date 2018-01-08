// helper.js
function divBlack(n){
    let color = 110 + n * 30;

    let sizeTable = [280, 180, 120, 100, 80]; 
    let fontSize = sizeTable[n] || 80; 

    return `color: rgb(${color}, ${color}, ${color});` + 
           `font-size: ${ fontSize }%`;  
}

module.exports = {
    pureDown: text => { 
        return text.split('').map((e, idx) => {
            let styleColor = divBlack(idx); 
            return `<span style="${styleColor}">${e}</span>`;
        }).join(''); 
    }
} 
