"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomChoice = exports.getRandomNumber = exports.generateString = void 0;
function generateString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateString = generateString;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomNumber = getRandomNumber;
function randomChoice(choices) {
    var random = Math.floor(Math.random() * choices.length);
    return choices[random];
}
exports.randomChoice = randomChoice;
