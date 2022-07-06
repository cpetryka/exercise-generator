export const convertStringToTitle = str => {
    str = str.replace(/-/g, ' ');
    str = str.charAt(0).toUpperCase() + str.slice(1);

    return str;
}

export const convertMapToObjectsArray = (map) => {
    const arr = [];

    for(let [key, value] of map) {
        const temp = {
            "key": key, 
            "value": value
        };

        arr.push(temp);
    }

    return arr;
}

export const convertObjectsArrayToMap = (objectsArray) => {
    const map = new Map();

    for(let obj of objectsArray) {
        map.set(obj.key, obj.value);
    }

    return map;
}

HTMLElement.prototype.printIt = printIt;
export function printIt(title) {
    var myframe = document.createElement('iframe');
    myframe.domain = document.domain;
    myframe.style.position = "absolute";
    myframe.style.top = "-10000px";
    document.body.appendChild(myframe);

    if(title !== undefined && title.length) {
        myframe.contentDocument.write(`<h1>${title}</h1>`);
    }

    myframe.contentDocument.write(this.innerHTML);
    myframe.contentDocument.write('<style>@import url("https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap");body{font-size:13.5px;font-family:"Barlow",sans-serif}*,::after,::before{box-sizing:border-box}.main-title{text-align:center;font-weight:700;font-size:32px;margin-bottom:0}h1{text-align:center;font-weight:700}.main-title + .separator {height: 0;}img{max-width:100%;margin-top:20px}.separator{margin-top:18px;border-bottom:1px dashed rgba(0, 0, 0, 0.8);text-align:center;font-weight:bold;font-size:18px;}.additional-heading{font-weight: 700;font-size:28px;text-decoration:underline;margin-top: 12px;margin-bottom: 0;cursor: pointer;} .additional-heading + .exercise > .exercise-heading {margin-top: 4px;}.exercise-heading{margin:0;margin-top:12px;font-size:24px;font-weight:600}.exercise-heading span{cursor:pointer}p{padding:0;margin:0}ol{margin:0;margin-top:5px;counter-reset:list}ol li{list-style:none;position:relative}ol li::before{content:counter(list) ")";counter-increment:list;left:-40px;padding-right:10px;position:absolute;text-align:right;width:40px}</style>');

    setTimeout(function () {
        myframe.focus();
        myframe.contentWindow.print();
        myframe.parentNode.removeChild(myframe); // remove frame
    }, 3000); // wait for images to load inside iframe

    window.focus();
}