// -------------MEMORY GAME


// =======================
// -------------INTRO
// =======================


window.addEventListener("load", () => {
    if (localStorage.getItem("firstLoad") == null || localStorage.getItem("firstLoad") == "") {
        localStorage.setItem("firstLoad", "loaded");
        alert("Welcome to the Animal Crossing. Oh sorry, forgot that's copyrighted... Nevermind, welcome to the Animal Memory.");
    }
    let text1 = "Welcome to Animal Memory, a memory game for your memory. :D";
    let text2 = "You might be asking yourself how to play this game. Don't worry, that is why this paragraph is here.";
    let text3 = "Please, insert your name so you can start the game. Once you start, the timer will start ticking.";
    let text4 = "When you are done, it will stop and the time position and username will be printed to the table. :)";
    let startTextArray = [text1, text2, text3, text4];
    startTextArray.forEach(text => {
        createP(tableDiv);
    });
    let tempP = tableDiv.querySelectorAll("p");
    for (let i = 0; i < tempP.length; i++) {
        tempP[i].appendChild(document.createTextNode(startTextArray[i]));
        tempP[i].style.margin = "2.3%";
        tempP[i].style.fontSize = "23px";
        tempP[0].style.fontWeight = "bold";
    }
});


// =======================
// -------------FUNCTIONS
// =======================


let createDiv = (element) => {
    let div = document.createElement("div");
    element.appendChild(div);
}

let createInput = (element) => {
    let input = document.createElement("input");
    element.appendChild(input);
}

let createH1 = (element) => {
    let h1 = document.createElement("h1");
    element.appendChild(h1);
}

let createP = (element) => {
    let p = document.createElement("p");
    element.appendChild(p);
}

let createGameTable = (element, lvlArr) => {
    element.appendChild(document.createElement("table"));
    let table = element.getElementsByTagName("table")[0];
    for (let i = 0; i < lvlArr; i++) {
        table.appendChild(document.createElement("tr"));
    }
    for (let j = 0; j < lvlArr; j++) {
        table.childNodes.forEach(tRow => {
            tRow.appendChild(document.createElement("td"));
        });
    }
}

let createLeaderboard = (element, rowNum, colNum) => {
    element.appendChild(document.createElement("table"));
    let table = element.getElementsByTagName("table")[0];
    
    for (let i = 0; i < rowNum; i++) {
        table.appendChild(document.createElement("tr"));
    }
    for (let k = 0; k < colNum; k++) {
        table.childNodes[0].appendChild(document.createElement("th"));
    }
    for (let k = 1; k < rowNum; k++) {
        for (let j = 0; j < colNum; j++) {
            table.childNodes[k].appendChild(document.createElement("td"));
        }
    }
}

let checkDiff = (diffArr, lvlArr) => {
    for (let i = 0; i < lvlArr.length; i++) {
        if (document.getElementById(`${diffArr[i]}`).checked == true) {
            return lvlArr[i];
        }
    }
}

let checkDiffName = (diff, diffArr, lvlArr) => {
    for (let i = 0; i < diffArr.length; i++) {
        if (diff == lvlArr[i]) {
            return diffArr[i];
        }
    }
}

let arrShuffle = (insertArr) => {
    let newPos, temp;
    for (let i = insertArr.length - 1; i > 0; i--) {
        newPos = Math.floor(Math.random() * (i + 1));
        temp = insertArr[i];
        insertArr[i] = insertArr[newPos];
        insertArr[newPos] = temp;
    }
    return insertArr;
}

let shuffleImgs = (hidCol, diff, imgArr) => {
    let shuffledArray = arrShuffle(imgArr);
    let cutArray = [];
    for (let k = 0; k < Math.pow(diff, 2) / 2; k++) {
        cutArray[k] = shuffledArray[k];
    }
    let mergedArray = cutArray.concat(cutArray);
    let mergedShuffled = arrShuffle(mergedArray);
    for (let i = 0; i < hidCol.length; i++) {
        hidCol[i].src = mergedShuffled[i];
        hidCol[i].style.display = "none";
    }
}

let flippingCards = (diff, diffArr, lvlArr, strNm) => {
    let diffName = checkDiffName(diff, diffArr, lvlArr);
    let counter = 0;
    let storedCard = null;
    let preventClick = false;
    inputTimerInput.value = "";
    for (let t = 0; t < Math.pow(diff, 2) * 2; t++) {
        clearInterval(timer);
        clearTimeout(delay);
        timer = null;
        tableDiv.querySelectorAll("img")[t].addEventListener("click", (event) => {
            delay = null;
            if (timer == null) {
                timer = setInterval(() => {
                    counter++;
                    inputTimerInput.value = counter;
                }, oneSecond);
            }
            const clickedCard = event.target;
            if (preventClick || clickedCard.nextSibling === null) {
                return;
            }
            if (storedCard === null) {
                clickedCard.style.display = "none";
                clickedCard.nextSibling.style.display = "block";
                storedCard = clickedCard.nextSibling;
                preventClick = false;
            }
            else if (storedCard.src === clickedCard.nextSibling.src) {
                clickedCard.style.display = "none";
                clickedCard.nextSibling.style.display = "block";
                storedCard.setAttribute("class", "match");
                clickedCard.nextSibling.setAttribute("class", "match");
                storedCard = null;
                preventClick = false;
            }
            else if (storedCard.src !== clickedCard.nextSibling.src) {
                clickedCard.style.display = "none";
                clickedCard.nextSibling.style.display = "block";
                preventClick = true;
                if (delay === null) {
                    delay = setTimeout(function() {
                        let face = document.querySelectorAll(".hidden");
                        for (let i = 0; i < face.length; i++) {
                            face[i].style.display = "none";
                            face[i].previousSibling.style.display = "block";
                            preventClick = false;
                        }
                    }, (oneSecond / 4) * 2);
                }
                storedCard = null;
            }
            if (document.querySelectorAll(".match").length == Math.pow(diff, 2)) {
                localStorage.setItem("gameDifficulty", `${diffName}`);
                localStorage.setItem("username", strNm);
                localStorage.setItem("time", `${inputTimerInput.value}`);
                storageFunction(lbArray);
                clearLeaderboard(nameFieldArray);
                sortLeaderboard(diffName, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);
                let playAgain = confirm("Congratulations, you win! :D\n\nDo you want to play again?");
                if (playAgain == true) {
                    gameStart(strNm, diff);
                }
                clearInterval(timer);
                clearTimeout(delay);
                timer = null;
            }
        });
    }
}

let gameStart = (strNm, diff) => {
    tableDiv.innerHTML = "";
    tableDiv.style.display = "flex";
    tableDiv.style.justifyContent = "center";
    tableDiv.style.alignContent = "center";
    createGameTable(tableDiv, diff);
    tableDiv.querySelector("table").style.display = "grid";
    tableDiv.querySelector("table").style.gridTemplateRows = `repeat(${diff}, auto)`;
    tableDiv.querySelector("table").style.gridGap = "7px";
    tableDiv.querySelectorAll("tr").forEach(tr => {
        tr.style.margin = "0";
        tr.style.padding = "0";
        tr.style.display = "grid";
        tr.style.gridGap = "7px";
        tr.style.gridTemplateColumns = `repeat(${diff}, auto)`;
    });
    for (let j = 0; j < Math.pow(diff, 2); j++) {
        tableDiv.querySelectorAll("td")[j].appendChild(document.createElement("img"));
        tableDiv.querySelectorAll("img")[j].setAttribute("src", "img/back.png");
        tableDiv.querySelectorAll("img")[j].setAttribute("class", "back");
        tableDiv.querySelectorAll("img")[j].setAttribute("alt", "Oopsie!");
        tableDiv.querySelectorAll("img")[j].style.display = "block";
    }
    for (let k = 0; k < Math.pow(diff, 2); k++) {
        tableDiv.querySelectorAll("td")[k].appendChild(document.createElement("img"));
    }
    document.querySelectorAll("img").forEach(img => {
        img.style.backgroundColor = "#00000023";
        img.style.borderRadius = "13px";
        img.style.margin = "0";
        img.style.padding = "0";
        img.style.userSelect = "none";
        img.ondragstart = function() {return false;};
    });
    let counter = 0;
    tableDiv.querySelectorAll("img").forEach(img => {
        if (counter % 2 != 0) {
            img.setAttribute("class", "hidden");
            img.style.backgroundColor = "#FFAFFA";
        }
        counter++;
    });
    if (window.innerWidth <= 600) {
        for (let i = 0; i < tableDiv.querySelectorAll("img").length; i++) {
            tableDiv.querySelectorAll("img")[i].style.height = `${((100 / 10) * 8.5) / (diff * 2)}vh`;
        }
    }
    else if (window.innerWidth > 600) {
        for (let i = 0; i < tableDiv.querySelectorAll("img").length; i++) {
            tableDiv.querySelectorAll("img")[i].style.height = `${((100 / 10) * 8.5) / (diff * 1.4)}vh`;
        }
    }
    let hiddenCollection = document.querySelectorAll(".hidden");
    shuffleImgs(hiddenCollection, diff, imageArray);
    flippingCards(diff, difficultyArray, levelArray, strNm);
}

function storageFunction(lbArr) {
    lbArr = JSON.parse(localStorage.getItem("leaderboard"));
    let player = {
        "difficulty": localStorage.getItem("gameDifficulty"),
        "username": localStorage.getItem("username"),
        "time": localStorage.getItem("time"),
    }
    lbArr.push(player);
    localStorage.setItem("leaderboard", JSON.stringify(lbArr));
}

function sortLeaderboard(diffName, lbArr, lbArrEa, lbArrNo, lbArrHa, lbArrEx) {
    lbArrEa = [];
    lbArrNo = [];
    lbArrHa = [];
    lbArrEx = [];
    lbArr = JSON.parse(localStorage.getItem("leaderboard"));
    let countEasy = 0;
    let countNormal = 0;
    let countHard = 0;
    let countExpert = 0;
    for (let i = 0; i < lbArr.length; i++) {
        if (lbArr[i].difficulty.includes("easy")) {
            countEasy++;
            lbArrEa.push(lbArr[i]);
            lbArrEa.sort(function(a, b) {
                return a.time - b.time;
            });
            if (countEasy > 5) {
                lbArrEa.pop();
            }
        }
        else if (lbArr[i].difficulty.includes("normal")) {
            countNormal++;
            lbArrNo.push(lbArr[i]);
            lbArrNo.sort(function(a, b) {
                return a.time - b.time;
            });
            if (countNormal > 5) {
                lbArrNo.pop();
            }
        }
        else if (lbArr[i].difficulty.includes("hard")) {
            countHard++;
            lbArrHa.push(lbArr[i]);
            lbArrHa.sort(function(a, b) {
                return a.time - b.time;
            });
            if (countHard > 5) {
                lbArrHa.pop();
            }
        }
        else if (lbArr[i].difficulty.includes("expert")) {
            countExpert++;
            lbArrEx.push(lbArr[i]);
            lbArrEx.sort(function(a, b) {
                return a.time - b.time;
            });
            if (countExpert > 5) {
                lbArrEx.pop();
            }
        }
        else {
            console.log("Nothing to do, leaderboard sorted already.");
        }
    }
    lbArr.concat(lbArrEa, lbArrNo, lbArrHa, lbArrEx);
    
    localStorage.setItem("leaderboard", JSON.stringify(lbArr));
    if (diffName == "easy") {
        printNames(nameFieldArray, lbArrEa);
    }
    else if (diffName == "normal") {
        printNames(nameFieldArray, lbArrNo);
    }
    else if (diffName == "hard") {
        printNames(nameFieldArray, lbArrHa);
    }
    else if (diffName == "expert") {
        printNames(nameFieldArray, lbArrEx);
    }
    else {
        console.log("Nothing done.");
    }
}

function clearLeaderboard(nFArr) {
    for (let i = 0; i < nFArr.length; i++) {
        nameFieldArray[i].innerHTML = "";
        timeFieldArray[i].innerHTML = "";
    }
}

function printNames(nFArr, diffArray) {
    for (let i = 0; i < nFArr.length; i++) {
        if (diffArray[i] == null) {
            return;
        }
        nFArr[i].innerHTML = diffArray[i].username;
        timeFieldArray[i].innerHTML = diffArray[i].time;
    }
}

// =======================
// -------------VARIABLES AND CREATING THE HTML
// =======================


let lbArray;
if (localStorage.getItem("leaderboard") == [] || localStorage.getItem("leaderboard") == null) {
    lbArray = [];
    localStorage.setItem("leaderboard", JSON.stringify(lbArray));
}
lbArray = JSON.parse(localStorage.getItem("leaderboard"));

let lbArrayEasy = [];
let lbArrayNormal = [];
let lbArrayHard = [];
let lbArrayExpert = [];

let timer = null;
let delay = null;
let oneSecond = 1000;
let oneMinute = 60*oneSecond;

let starSelector = document.getElementsByTagName("*");
let htmlBody = document.body;

let difficultyArray = ["easy", "normal", "hard", "expert"];

let levelArray = [];
let difficultyStep = 4;
for (let i = 0; i < difficultyArray.length; i++) {
    levelArray[i] = difficultyStep;
    difficultyStep += 2;
}

let lastDifficulty = levelArray[levelArray.length - 1];
let imageArray = [];
for (let i = 0; i < Math.pow(lastDifficulty, 2) / 2; i++) {
    imageArray[i] = `animals/${i + 1}.png`;
}

let bodyDivArray = ["primary", "secondary"];
for (let i = 0; i < bodyDivArray.length; i++) {createDiv(htmlBody);}
for (let i = 0; i < bodyDivArray.length; i++) {
    htmlBody.getElementsByTagName("div")[i].setAttribute("id", `${bodyDivArray[i]}`);
}

let primaryDiv = document.getElementById("primary");
let secondaryDiv = document.getElementById("secondary");


let primaryDivArray = ["title1", "timer", "name", "difficulty", "table"];
for (let i = 0; i < primaryDivArray.length; i++) {createDiv(primaryDiv);}
for (let i = 0; i < primaryDivArray.length; i++) {
    primaryDiv.getElementsByTagName("div")[i].setAttribute("id", `${primaryDivArray[i]}`);
}

let title1Div = document.getElementById("title1");
let nameDiv = document.getElementById("name");
let timerDiv = document.getElementById("timer");
let difficultyDiv = document.getElementById("difficulty");
let tableDiv = document.getElementById("table");

createH1(title1Div);
title1Div.getElementsByTagName("h1")[0].appendChild(document.createTextNode("Animal Memory"));

createInput(timerDiv);
timerDiv.querySelector("input").setAttribute("id", "inputTimer");
let inputTimerInput = document.getElementById("inputTimer");
inputTimerInput.setAttribute("placeholder", 0);
inputTimerInput.setAttribute("value", "");
inputTimerInput.readOnly = true;

createInput(nameDiv);
nameDiv.querySelector("input").setAttribute("id", "inputName");

let inputNameInput = document.getElementById("inputName");
inputNameInput.setAttribute("type", "text");
inputNameInput.setAttribute("name", "submit");
inputNameInput.setAttribute("placeholder", "Insert name here.");

for (let i = 0; i < difficultyArray.length; i++) {
    createDiv(difficultyDiv);
}
difficultyDiv.querySelectorAll("div").forEach(div => {
    div.setAttribute("class", "radioDiv");
    div.appendChild(document.createElement("input"));
    div.appendChild(document.createElement("p"));
});

for (let i = 0; i < difficultyArray.length; i++) {
    difficultyDiv.querySelectorAll("input")[i].setAttribute("id", `${difficultyArray[i]}`);
    difficultyDiv.querySelectorAll("input")[i].setAttribute("class", "inputDifficulty");
    difficultyDiv.querySelectorAll("input")[i].setAttribute("type", "radio");
    difficultyDiv.querySelectorAll("input")[i].setAttribute("name", "difficulty");
}
let difficultySelect = document.querySelectorAll(".inputDifficulty");
difficultyDiv.querySelectorAll("input")[0].checked = true;

for (let i = 0; i < difficultyArray.length; i++) {
    difficultyDiv.querySelectorAll("p")[i].appendChild(document.createTextNode(`${difficultyArray[i]}`));
}

let secondaryDivArray = ["title2", "leaderboardSelect", "leaderboard"];
for (let i = 0; i < secondaryDivArray.length; i++) {createDiv(secondaryDiv);}
for (let i = 0; i < secondaryDivArray.length; i++) {
    secondaryDiv.getElementsByTagName("div")[i].setAttribute("id", `${secondaryDivArray[i]}`);
}

let title2Div = document.getElementById("title2");
let leaderboardSelectDiv = document.getElementById("leaderboardSelect");
let leaderboardDiv = document.getElementById("leaderboard");

createH1(title2Div);
title2Div.getElementsByTagName("h1")[0].appendChild(document.createTextNode("Leaderboard"));

for (let i = 0; i < difficultyArray.length; i++) {
    createInput(leaderboardSelectDiv);
}
for (let i = 0; i < difficultyArray.length; i++) {
    leaderboardSelectDiv.querySelectorAll("input")[i].setAttribute("class", `buttonDifficulty`);
    leaderboardSelectDiv.querySelectorAll("input")[i].setAttribute("type", "button");
    leaderboardSelectDiv.querySelectorAll("input")[i].setAttribute("value", `${difficultyArray[i]}`);
}

let lbRows = 6;
let lbColumns = 3;
createLeaderboard(leaderboardDiv, lbRows, lbColumns);


// =======================
// -------------EVENT LISTENERS
// =======================


window.addEventListener("unload", () => {
    localStorage.removeItem("gameDifficulty");
    localStorage.removeItem("username");
    localStorage.removeItem("time");
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("inputName", `${inputNameInput.value}`);
});
window.addEventListener("load", () => {
    inputNameInput.defaultValue = "";
    if (localStorage.getItem("inputName") != null) {
        inputNameInput.defaultValue = `${localStorage.getItem("inputName")}`;
    }
});

inputNameInput.addEventListener("keyup", (event) => {
    clearInterval(timer);
    let difficulty = checkDiff(difficultyArray, levelArray);
    if (event.keyCode == 13) {
        let storedName = inputNameInput.value;
        if (storedName == null || storedName == "") {
            let name = prompt("Please, enter your name:");
            if (name == null || name == "") {
                inputTimerInput.value = "";
                alert("No name entered!");
                tableDiv.innerHTML = "";
            }
            else {
                inputNameInput.value = name;
                storedName = inputNameInput.value;
                gameStart(storedName, difficulty);
            }
        }
        else {
            gameStart(storedName, difficulty);
        }
    }
});

for (let i = 0; i < document.querySelectorAll(".radioDiv").length; i++) {
    document.querySelectorAll(".radioDiv")[i].childNodes[0].addEventListener("click", () => {
        clearInterval(timer);
        let difficulty = checkDiff(difficultyArray, levelArray);
        let storedName = inputNameInput.value;
        if (storedName == null || storedName == "") {
            let name = prompt("Please, enter your name:");
            if (name == null || name == "") {
                inputTimerInput.value = "";
                alert("No name entered!");
                tableDiv.innerHTML = "";
            }
            else {
                inputNameInput.value = name;
                storedName = inputNameInput.value;
                gameStart(storedName, difficulty);
            }
        }
        else {
            gameStart(storedName, difficulty);
        }
    });
}


// =======================
// -------------STYLING THE HTML
// =======================


for (let i = 0; i < starSelector.length; i++) {
    starSelector[i].style.boxSizing = "border-box";
    starSelector[i].style.padding = "0px";
    starSelector[i].style.margin = "0px";
}

htmlBody.style.fontFamily = "Fira Sans Condensed, Liberation Sans";
htmlBody.style.backgroundColor = "#ED6441"

primaryDiv.style.textAlign = "center";
primaryDiv.style.float = "left";
primaryDiv.style.backgroundColor = "#35BC66";

secondaryDiv.style.textAlign = "center";
secondaryDiv.style.float = "left";
secondaryDiv.style.backgroundColor = "#ED6441";

leaderboardDiv.style.margin = "2.3%";

document.querySelectorAll("table").forEach(table => {
    table.style.borderCollapse = "collapse";
});

let thCounter = 0;
document.querySelectorAll("th").forEach(th => {
    th.style.padding = ".5em";
    th.style.border = ".05em solid black";
    if (thCounter % 3 == 0) {
        th.style.backgroundColor = "#D97300";
        th.style.width = "10%";
        th.appendChild(document.createTextNode("Position"));
    }
    else if (thCounter % 3 == 1) {
        th.style.backgroundColor = "#00B0D5";
        th.style.width = "80%";
        th.appendChild(document.createTextNode("Name"));
    }
    else {
        th.style.backgroundColor = "#00CA8A";
        th.style.width = "10%";
        th.appendChild(document.createTextNode("Time"));
    }
    thCounter++;
});

let tdCounter = 0;
let positionNumber = 0;
document.querySelectorAll("td").forEach(td => {
    td.style.padding = ".5em";
    td.style.border = ".05em solid black";
    if (tdCounter % 3 == 0) {
        positionNumber++;
        td.style.backgroundColor = "#FFC37F";
        td.style.width = "10%";
        td.appendChild(document.createTextNode(`${positionNumber}.`));
    }
    else if (tdCounter % 3 == 1) {
        td.style.backgroundColor = "#9FEEFF";
        td.style.width = "80%";
        td.setAttribute("class", "lbName");
    }
    else {
        td.style.backgroundColor = "#70FFD2";
        td.style.width = "10%";
        td.setAttribute("class", "lbTime");
    }
    tdCounter++;
});

let nameTd = document.querySelectorAll(".lbName");
for (let i = 0; i < nameTd.length; i++) {
    nameTd[i].setAttribute("id", `n${i + 1}`)
}
let timeTd = document.querySelectorAll(".lbTime");
for (let i = 0; i < timeTd.length; i++) {
    timeTd[i].setAttribute("id", `t${i + 1}`)
}

let nameFieldArray = document.querySelectorAll(".lbName");
let timeFieldArray = document.querySelectorAll(".lbTime");
let lbRowsArray = document.querySelectorAll("tr");

let startDifficulty = checkDiffName(checkDiff(difficultyArray, levelArray), difficultyArray, levelArray);
clearLeaderboard(nameFieldArray);
sortLeaderboard(startDifficulty, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);

let lbButtons = document.getElementsByClassName("buttonDifficulty");
lbButtons[0].addEventListener("click", () => {
    let diffName = "easy";
    clearLeaderboard(nameFieldArray);
    sortLeaderboard(diffName, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);
});
lbButtons[1].addEventListener("click", () => {
    let diffName = "normal";
    clearLeaderboard(nameFieldArray);
    sortLeaderboard(diffName, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);
});
lbButtons[2].addEventListener("click", () => {
    let diffName = "hard";
    clearLeaderboard(nameFieldArray);
    sortLeaderboard(diffName, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);
});
lbButtons[3].addEventListener("click", () => {
    let diffName = "expert";
    clearLeaderboard(nameFieldArray);
    sortLeaderboard(diffName, lbArray, lbArrayEasy, lbArrayNormal, lbArrayHard, lbArrayExpert);
});

title1Div.style.margin = "2.3%";
title1Div.style.float = "left";
title1Div.style.width = "70%";

timerDiv.style.margin = "2.3%";
timerDiv.style.float = "left";
timerDiv.style.width = "20.8%";

document.getElementById("inputTimer").style.padding = ".22em";
document.getElementById("inputTimer").style.width = "100%";
document.getElementById("inputTimer").style.textAlign = "center";
document.getElementById("inputTimer").style.fontFamily = "Fira Sans Condensed, Liberation Sans";
document.getElementById("inputTimer").style.fontSize = "23px";
document.getElementById("inputTimer").style.fontWeight = "bold";

nameDiv.style.margin = "2.3%";
nameDiv.style.width = "95.4%";

document.getElementById("inputName").style.width = "100%";
document.getElementById("inputName").style.padding = ".4em";
document.getElementById("inputName").style.fontFamily = "Fira Sans Condensed, Liberation Sans";
document.getElementById("inputName").style.fontSize = "23px";
document.getElementById("inputName").style.fontWeight = "bold";

difficultyDiv.style.margin = "2.3%";
difficultyDiv.style.overflow = "hidden";

for (let i = 0; i < difficultyArray.length; i++) {
    document.querySelectorAll(".radioDiv")[i].style.textAlign = "center";
    document.querySelectorAll(".radioDiv")[i].style.padding = "3%";
    document.querySelectorAll(".radioDiv")[i].style.paddingTop = ".1em";
    document.querySelectorAll(".radioDiv")[i].style.paddingBottom = ".1em";
    document.querySelectorAll(".radioDiv")[i].style.float = "left";
    document.querySelectorAll(".radioDiv")[i].style.backgroundColor = "#6CED41";
    document.querySelectorAll(".radioDiv")[i].style.fontWeight = "bold";
}
document.querySelectorAll(".radioDiv > p, .radioDiv > input").forEach(element => {
    element.style.margin = "2.3%";
});

for (let i = 0; i < difficultyArray.length; i++) {
    document.querySelectorAll(".radioDiv")[i].onmouseover = function() {mouseOver()};
    function mouseOver() {
        document.querySelectorAll(".radioDiv")[i].style.backgroundColor = "#6CED4195";
    }
}
for (let i = 0; i < difficultyArray.length; i++) {
    document.querySelectorAll(".radioDiv")[i].onmouseout = function() {mouseOut()};
    function mouseOut() {
        document.querySelectorAll(".radioDiv")[i].style.backgroundColor = "#6CED41";
    }
}

title2Div.style.margin = "2.3%";

leaderboardSelectDiv.style.margin = "2.3%";

for (let i = 0; i < difficultyArray.length; i++) {
    document.querySelectorAll(".buttonDifficulty")[i].style.padding = "2%";
    document.querySelectorAll(".buttonDifficulty")[i].style.paddingTop = "1em";
    document.querySelectorAll(".buttonDifficulty")[i].style.paddingBottom = "1em";
    document.querySelectorAll(".buttonDifficulty")[i].style.fontFamily = "Fira Sans Condensed, Liberation Sans";
    document.querySelectorAll(".buttonDifficulty")[i].style.fontWeight = "bold";
    document.querySelectorAll(".buttonDifficulty")[i].style.backgroundColor = "#CD1D27";
    document.querySelectorAll(".buttonDifficulty")[i].style.border = "0";
}

for (let i = 0; i < difficultyArray.length; i++) {
    document.getElementsByClassName("buttonDifficulty")[i].onmouseover = function() {mouseOver()};
    function mouseOver() {
        document.getElementsByClassName("buttonDifficulty")[i].style.backgroundColor = "#CD1D2795";
    }
    document.getElementsByClassName("buttonDifficulty")[i].onmouseout = function() {mouseOut()};
    function mouseOut() {
        document.getElementsByClassName("buttonDifficulty")[i].style.backgroundColor = "#CD1D27";
    }
}


// =======================
// -------------RESPONSIVE DESIGN
// =======================


function resizeTablet(tablet) {
    if (tablet.matches) {
        document.querySelectorAll(".radioDiv").forEach(div => {
            div.style.width = `${100 / 2}%`;
        });
        primaryDiv.style.width = "100%";
        primaryDiv.style.minHeight = `50vh`;
        secondaryDiv.style.width = "100%";
        secondaryDiv.style.minHeight = `50vh`;
    }
    else {
        document.querySelectorAll(".radioDiv").forEach(div => {
            div.style.width = `${100 / difficultyArray.length}%`;
        });
        document.querySelectorAll(".buttonDifficulty").forEach(button => {
            button.style.width = `${100 / difficultyArray.length}%`;
        });
        primaryDiv.style.width = "70%";
        primaryDiv.style.minHeight = `100vh`;
        secondaryDiv.style.width = "30%";
        secondaryDiv.style.minHeight = `100vh`;
    }
}
let tabletSize = window.matchMedia("(max-width: 820px)");
resizeTablet(tabletSize);
tabletSize.addListener(resizeTablet);

function resizeMobile(mobile) {
    if (mobile.matches) {
        document.querySelectorAll(".buttonDifficulty").forEach(button => {
            button.style.width = `${100 / (difficultyArray.length / 2)}%`;
        });
    }
    else {
        document.querySelectorAll(".buttonDifficulty").forEach(button => {
            button.style.width = `${100 / difficultyArray.length}%`;
        });
    }
}
let mobileSize = window.matchMedia("(max-width: 500px)");
resizeMobile(resizeMobile);
mobileSize.addListener(resizeMobile);

window.addEventListener("resize", () => {
    // console.log(window.innerWidth);
    let difficulty = checkDiff(difficultyArray, levelArray);
    if (tableDiv.querySelector("table") == null) {
        return;
    }
    else if (window.innerWidth <= 600) {
        for (let i = 0; i < tableDiv.querySelectorAll("img").length; i++) {
            tableDiv.querySelectorAll("img")[i].style.height = `${((100 / 10) * 8.5) / (difficulty * 2)}vh`;
        }
    }
    else {
        for (let i = 0; i < tableDiv.querySelectorAll("img").length; i++) {
            tableDiv.querySelectorAll("img")[i].style.height = `${((100 / 10) * 8.5) / (difficulty * 1.4)}vh`;
        }
    }
});