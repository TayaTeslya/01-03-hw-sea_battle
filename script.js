const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const fourButton = document.getElementById('four-button');
const threeButton = document.getElementById('three-button');
const twoButton = document.getElementById('two-button');
const oneButton = document.getElementById('one-button');
const deleteButton = document.getElementById('delete-button');
const turnButton = document.getElementById('turn-button');
const readyButton = document.getElementById('ready-button');
let shipActive;
let ships = [];

let four = {
    button: fourButton,
    max: 1,
    elements: 0
};

let three = {
    button: threeButton,
    max: 2,
    elements: 0
};

let two = {
    button: twoButton,
    max: 3,
    elements: 0
};

let one = {
    button: oneButton,
    max: 4,
    elements: 0
};

let buttons = {
    four,
    three,
    two,
    one
}

function createElement(box, tag, classTags) { //ф-ция создания элемента
    let element = document.createElement(tag); //создали элемент 
    for (let i = 0; i < classTags.length; i++)  
        element.classList.add(classTags[i]); //даем класс элементу
    box.appendChild(element); //пихаем в поле
    return element;
}

function generateBox(player) { //генерируем поле
    let cell;
    for (let i = 0; i < 100 ; i++) {
        cell = createElement(player, 'div', ['cell']);
        cell.addEventListener('click', function(event){
            if (shipActive) {
                checkShipPosition(event.target.offsetLeft, event.target.offsetTop);
                shipActive.classList.remove('active-ship');
                blockButtons();
                shipActive = null;
            }
        });
    }
}

function checkShipPosition(left, top) {
    if (500 - left < getComputedStyle(shipActive).width.replace('px', '')) {
        left = 500 - getComputedStyle(shipActive).width.replace('px', '');
    }
    if (500 - top < getComputedStyle(shipActive).height.replace('px', '')) {
        top = 500 - getComputedStyle(shipActive).height.replace('px', '');
    }
    let right = Number(left) + Number(getComputedStyle(shipActive).width.replace('px', '')) - 50;
    let bottom = Number(top) + Number(getComputedStyle(shipActive).height.replace('px', '')) - 50;
    let rightShip;
    let bottomShip;
    let difference = false;
    let leftShip;
    let topShip;
    for (const ship of ships) { //красная, если расставлен близко к другому
        if (ship.ship != shipActive) {
            rightShip = ship.ship.offsetLeft + Number(getComputedStyle(ship.ship).width.replace('px', '')) - 50;
            bottomShip = ship.ship.offsetTop + Number(getComputedStyle(ship.ship).height.replace('px', '')) - 50;
            leftShip = ship.ship.offsetLeft;
            topShip = ship.ship.offsetTop;
            //если активный выше, берем конец активного и начало неактивного, иначе - начало активного и конец неактивного
            if (top < topShip) { //bottom и topShip
                //если активный находится левее, то берем конец активного и начало неактивного, иначе - начало активного, конец неактивного
                if (left < leftShip) { //right и leftShip
                    if (leftShip - right <= 50 && topShip - bottom <= 50) {
                        difference = true;
                    }
                } else {  //left и rightShip
                    if (left - rightShip <= 50 && topShip - bottom <= 50) {
                        difference = true;
                    }
                }
            } else { //top и bottomShip
                //если активный находится левее, то берем конец активного и начало неактивного, иначе - начало активного, конец неактивного
                if (left < leftShip) { //right и leftShip
                    if (leftShip - right <= 50 && top - bottomShip <= 50) {
                        difference = true;
                    }
                } else {  //left и rightShip
                    if (left - rightShip <= 50 && top - bottomShip <= 50) {
                        difference = true;
                    }
                }
            }
        }
    }
    if (difference) {
        shipActive.classList.add('ship-red');
    } else {
        shipActive.classList.remove('ship-red');
    }
    setShipPosition(left, top);
    //проверка на актуальность красного эффекта
    checkRelevancePosition(); 
}

function checkRelevancePosition() {
    let leftA, topA, rightA, bottomA;
    let leftB, topB, rightB, bottomB;
    let difference;
    for (const shipA of ships) {
        difference = false;
        leftA = shipA.ship.offsetLeft;
        topA = shipA.ship.offsetTop;
        rightA = Number(leftA) + Number(getComputedStyle(shipA.ship).width.replace('px', '')) - 50;
        bottomA = Number(topA) + Number(getComputedStyle(shipA.ship).width.replace('px', '')) - 50;
        for (const shipB of ships) {
            if (shipB.ship != shipA.ship) {
                leftB = shipB.ship.offsetLeft;
                topB = shipB.ship.offsetTop;
                rightB = Number(leftB) + Number(getComputedStyle(shipB.ship).width.replace('px', '')) - 50;
                bottomB = Number(topB) + Number(getComputedStyle(shipB.ship).width.replace('px', '')) - 50;
                //проверка
            }
        }
        if (difference) {
            shipActive.classList.add('ship-red');
        } else {
            shipActive.classList.remove('ship-red');
        }
    }
}

function setShipPosition(left, top) {
    shipActive.style.left = left + 'px';
    shipActive.style.top = top + 'px';
}

function addShip(classTag, left) {
    let ship = createElement(player1, 'div', ['ship', classTag]);
    ship.style.top = '40%';
    ship.style.left = left;
    ships.push({
        lengthShip: classTag,
        directionShip: 'horizontal',
        ship, //ship: ship
        btn: buttons[classTag]
    });
    shipActive = ship;
    ship.classList.add('active-ship');
    blockButtons();
    ship.addEventListener('click', function(){
        if (ship != shipActive) {
            if (shipActive == null) {
                blockButtons();
                shipActive = ship;
                ship.classList.add('active-ship');
            }
        } else {
            blockButtons();
            shipActive = null;
            ship.classList.remove('active-ship');
        }
    })
}

function blockButtons() {
    let count = 0;
    for (const btn in buttons) {
        buttons[btn].button.disabled = buttons[btn].elements == buttons[btn].max ? true : !buttons[btn].button.disabled;
        count += buttons[btn].elements;
    }
    readyButton.disabled = count == 10 ? false : true;
    turnButton.disabled = !turnButton.disabled;
    deleteButton.disabled = !deleteButton.disabled;
}

function addElements(clickButton) {
    for (const btn in buttons) {
        if (buttons[btn].button == clickButton) {
            buttons[btn].elements++;
        }
    }
}

function init() { /* это запуск всех ф-ций */

    generateBox(player1);
    generateBox(player2);

    fourButton.addEventListener('click', function(){
        addShip('four', '30%');
        addElements(fourButton);
    }); /* "слушаем" событие  - клик, ф-ция при выполнении события*/
    
    threeButton.addEventListener('click', function(){
        addShip('three', '30%');
        addElements(threeButton);
    }); /* таким образом ф-ция создается только при нажатии на кнопку, а после выполнения удаляется */
    
    twoButton.addEventListener('click', function(){
        addShip('two', '40%');
        addElements(twoButton);
    });
    
    oneButton.addEventListener('click', function(){
        addShip('one', '40%');
        addElements(oneButton);
    }); 

    deleteButton.addEventListener('click', function(){
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].ship == shipActive) {
                for (const btn in buttons) {
                    if (buttons[btn].button == ships[i].btn.button) {
                            buttons[btn].elements--;
                        }
                    }
                ships.splice(i, 1); //удаляем объект из массива кораблей
                break;
            }
        }
        player1.removeChild(shipActive);
        blockButtons();
    });
    
    turnButton.addEventListener('click', function(){
        let wh = getComputedStyle(shipActive).width;
        shipActive.style.width = getComputedStyle(shipActive).height;
        shipActive.style.height = wh;
        shipActive.classList.remove('active-ship');
        checkShipPosition(shipActive.style.left.replace('px', ''), shipActive.style.top.replace('px', ''));
        for (let i = 0; i < ships.length; i++) {
            if (ships[i].ship == shipActive) {
                ships[i].directionShip = (ships[i].directionShip == 'horizontal') ? 'vertical' : 'horizontal'; 
                break;
            }
        }
        blockButtons();
        shipActive = null;
    });

}

init();