"use strict";


function Navigation() {
    var bodyEl = document.body;

    function init() {
        initEvents();
    }

    init();
};


window.onload = function () {

}

function memeo(x, f = () => x) {
    var x;
    var y = x;
    x = 2;
    return [x, y, f()];
}
var myFunction = (a) => a;

var leapYear = function (year) {
    if ((year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
        return true
    } else {
        return false
    }
};

var leapYear = function (year) {
    if (year % 4 === 0) {
        if(year % 100 === 0) {
            if(year % 400 === 0) {
                return true;
            }
            return false;
        }
        return true;
    } else {
        return false
    }
};


function strReplace(my_strings){
    const regex = /g/gi;
    const regex1 = /o/gi;
    const  regex2 = /e/gi;

    let new_str = my_strings.replace(regex, 'A');

    let new_str_3 = '';

    if(new_str) {
        let new_str_2 = new_str.replace(regex1, 'q');
        if(new_str_2) {
            new_str_3 = new_str_2.replace(regex2, 'g');
            console.log('3a: ',new_str_3);
        }
    }

    console.log('3b: ',new_str_3);
    return new_str_3;
}