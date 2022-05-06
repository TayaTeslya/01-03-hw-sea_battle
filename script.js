const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const fourButton = document.getElementById('four-button');
const threeButton = document.getElementById('three-button');
const twoButton = document.getElementById('two-button');
const oneButton = document.getElementById('one-button');
const deleteButton = document.getElementById('delete-button');
const turnButton = document.getElementById('turn-button');
const readyButton = document.getElementById('ready-button');
const boxConteiner = document.getElementsByClassName('box-conteiner')[0];
const player1Cover = document.getElementById('player1-cover');
const player2Cover = document.getElementById('player2-cover');
const readyPlayerButton = document.getElementById('button-ready-player');
let shipActive;
let ships = [];
let shipsPlayer1 = [];
let shipsPlayer2 = [];
let box = player1;

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

/**
 * @param {HTMLElement} player - поле с ячейками для определенного игрока
 * - Генерирует поле с ячейками
 * - Клик по ячейке для установки корабля
 */
function generateBox(player) { 
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
            if (event.target.parentNode.id == 'player1-cover' || event.target.parentNode.id == 'player2-cover') {
                console.log('kek');

            }
        });
    }
}

/**
 * @param {HTMLElement} box - поле, в котором мы создаем элемент (корабль)
 * @param {String} tag - тэг html-элемента
 * @param {String} classTags - класс html-элемента
 * @returns {HTMLelement} - возвращает добавленный html-элемент
 * 1) Создает элемент (корабль)
 * 2) Дает элементу классы (класс ship и four/tree/two/one)
 * 3) Добавляет созданный элемент в поле
 */
function createElement(box, tag, classTags) {
    let element = document.createElement(tag); // 1
    for (let i = 0; i < classTags.length; i++)  
        element.classList.add(classTags[i]); // 2
    box.appendChild(element); // 3
    return element;
}

/**
 * @param {String} classTag - класс размера корабля
 * @param {String} left - для позиционирования корабля
 * 1) Добавляет корабль
 * 2) Задает стартовые координаты
 * 3) Добавляет корабль в массив кораблей
 * 4) Делает корабль активным для размещения
 * 5) Блокирует кнопки добавления нового корабля пока не поставим
 * 6) Событие при клике на корабль - делает его активным, если никакой не был активным
 */
function addShip(classTag, left) {
    let ship = createElement(box, 'div', ['ship', classTag]); // 1
    ship.style.top = '40%'; // 2
    ship.style.left = left;
    ships.push({ // 3
        lengthShip: classTag,
        directionShip: 'horizontal',
        ship, //ship: ship
        btn: buttons[classTag]
    });
    shipActive = ship; // 4
    ship.classList.add('active-ship');
    blockButtons(); // 5
    ship.addEventListener('click', function(){ // 6
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

/**
 * @param {HTMLElement} clickButton - кнопка добавления корабля
 * Добавляет объекту four/three/two/one в объекте buttons +1 к кол-ву поставленных кораблей
 */
function incElements(clickButton) {
    for (const btn in buttons) {
        if (buttons[btn].button == clickButton) {
            buttons[btn].elements++;
        }
    }
}

/**
 * @param {number} left - позиция относительно левого края
 * @param {number} top - позиция относительно верхнего края
 * Ставит корабль на выбранную позицию
 */
function setShipPosition(left, top) {
    shipActive.style.left = left + 'px';
    shipActive.style.top = top + 'px';
}

/**
 * @param {number | string} left - позиция относительно левого края
 * @param {number | string} top - позиция относительно верхнего края
 * 1) Проверка на выход за границы поля - двигает при выходе за границы 
 * 2) Ставит на координаты
 * 3) Проверяет наличие пересечений
 */
function checkShipPosition(left, top) {
    if (500 - left < getComputedStyle(shipActive).width.replace('px', '')) { // 1
        left = 500 - getComputedStyle(shipActive).width.replace('px', '');
    }
    if (500 - top < getComputedStyle(shipActive).height.replace('px', '')) {
        top = 500 - getComputedStyle(shipActive).height.replace('px', '');
    }
    setShipPosition(left, top); // 2
    checkShipCross(); // 3
}

/**
 * 1) Поочередно берет координаты каждого корабля и сравнивает с координатами остальных кораблей
 * 2) Делает пересекающиеся корабли красными - дает класс red-ship
 * 3) Делает непересекающиеся корабли обычными - убирает класс red-ship
 */
function checkShipCross() {
    let leftA, topA, rightA, bottomA;
    let leftB, topB, rightB, bottomB;
    let difference;
    for (const shipA of ships) { // 1
        difference = false;
        leftA = shipA.ship.offsetLeft;
        topA = shipA.ship.offsetTop;
        rightA = Number(leftA) + Number(getComputedStyle(shipA.ship).width.replace('px', '')) - 50;
        bottomA = Number(topA) + Number(getComputedStyle(shipA.ship).height.replace('px', '')) - 50;
        for (const shipB of ships) {
            if (shipB.ship != shipA.ship) {
                leftB = shipB.ship.offsetLeft;
                topB = shipB.ship.offsetTop;
                rightB = Number(leftB) + Number(getComputedStyle(shipB.ship).width.replace('px', '')) - 50;
                bottomB = Number(topB) + Number(getComputedStyle(shipB.ship).height.replace('px', '')) - 50;
                //если активный находится выше, берем конец активного и начало неактивного, иначе - начало активного и конец неактивного
                if (topA < topB) { //bottomA и topB
                    //если активный находится левее, берем конец активного и начало неактивного, иначе - начало активного, конец неактивного
                    if (leftA < leftB) { //rightA и leftB
                        if (leftB - rightA <= 50 && topB - bottomA <= 50) {
                            difference = true;
                        }
                    } else {  //leftA и rightB
                        if (leftA - rightB <= 50 && topB - bottomA <= 50) {
                            difference = true;
                        }
                    }
                } else { //topA и bottomB
                    //если активный находится левее, берем конец активного и начало неактивного, иначе - начало активного, конец неактивного
                    if (leftA < leftB) { //rightA и leftB
                        if (leftB - rightA <= 50 && topA - bottomB <= 50) {
                            difference = true;
                        }
                    } else {  //leftA и rightB
                        if (leftA - rightB <= 50 && topA - bottomB <= 50) {
                            difference = true;
                        }
                    }
                }
            }
        }
        if (difference) {
            shipA.ship.classList.add('ship-red'); // 2
        } else {
            shipA.ship.classList.remove('ship-red'); // 3
        }
    }
}

/**
 * 1) Блокирует кнопки добавления кораблей, если их уже максимум или если активен какой-то корабль
 * 2) Блокирует кнопку "Готово", если есть пересекающиесся корабли и/или не все корабли поставлены
 * 3) Блокирует/разблокирует кнопки поворота и удаления корабля если какой-то корабль неактивен/активен соответственно
 */
function blockButtons() {
    if (ships != null) {
        let count = 0; // 1
        for (const btn in buttons) {
            buttons[btn].button.disabled = buttons[btn].elements == buttons[btn].max ? true : !buttons[btn].button.disabled;
            count += buttons[btn].elements;
        }
        let redship = false; // 2
        for (const ship of ships) {
            if (ship.ship.classList.contains('ship-red')) {
                redship = true;
            }
        }
        readyButton.disabled = false;
        if (!redship) {
            //readyButton.disabled = count == 10 ? false : true;
        }
        turnButton.disabled = !turnButton.disabled; // 3
        deleteButton.disabled = !deleteButton.disabled;
    } else {
        for (const button in buttons) {
            buttons[button].button.classList.add('visibility');
            buttons[button].button.disabled = true;
        }
        turnButton.disabled = true;
        turnButton.classList.add('visibility');
        deleteButton.disabled = true;
        deleteButton.classList.add('visibility');   
    }
}

/**
 * Инициализирующая ф-ция (ф-ция запуска программы)
 */
function init() {

    generateBox(player1);
    generateBox(player2);

    fourButton.addEventListener('click', ()=>{ //по клику на кнопку *четыре* добавляем четырехпалубный корабль
        addShip('four', '30%'); //Добавляем корабль на поле с классом four и ставим ~на середину (30%)
        incElements(fourButton); //Добавляем +1 к кол-ву четырехпалубных кораблей
    });
    
    threeButton.addEventListener('click', ()=>{
        addShip('three', '30%');
        incElements(threeButton);
    });

    twoButton.addEventListener('click', ()=>{
        addShip('two', '40%');
        incElements(twoButton);
    });
    
    oneButton.addEventListener('click', ()=>{
        addShip('one', '40%');
        incElements(oneButton);
    }); 

    /**
     * 1) Отнимаем от кол-ва кораблей 1 (от кол-ва кораблей размера выбранного корабля)
     * 2) Удаляем объект корабля из массива кораблей
     * 3) Удаляем корабль из html-документа
     */
    deleteButton.addEventListener('click', ()=>{
        for (let i = 0; i < ships.length; i++) { // 1
            if (ships[i].ship == shipActive) {
                for (const btn in buttons) {
                    if (buttons[btn].button == ships[i].btn.button) {
                            buttons[btn].elements--;
                        }
                    }
                ships.splice(i, 1); // 2
                break;
            }
        }
        player1.removeChild(shipActive); // 3
        shipActive = null;
        blockButtons();
    });
    
    /**
     * 1) Меняем местами высоту и ширину ("поворачиваем" корабль)
     * 2) Если корабль выходит за границу, двигаем его
     */
    turnButton.addEventListener('click', ()=>{
        let wh = getComputedStyle(shipActive).width; // 1
        shipActive.style.width = getComputedStyle(shipActive).height;
        shipActive.style.height = wh;
        shipActive.classList.remove('active-ship');
        checkShipPosition(shipActive.style.left.replace('px', ''), shipActive.style.top.replace('px', '')); // 2
        blockButtons();
        shipActive = null;
    });

    /**
     * 1) Меняем местами поля и скрываем поле первого игрока
     * 2) Добавляем в shipsPlayer1 все из ships, ships обнуляем
     * 3) Обнуляем кнопки
     * 4) по второму нажатию скрываем оба поля и вызываем модальное окно
     * 
     */
    readyButton.addEventListener('click', ()=>{
        if (!boxConteiner.classList.contains('box-reverse')) { // 1
            if (box == player1) {
                box = player2;
                player1Cover.style.display = 'flex';
                generateBox(player1Cover);
            }
            boxConteiner.classList.add('box-reverse');
            // shipsPlayer1 = ships;
            shipsPlayer1 = [...ships] // 2
            /* возьмет все содержимое из ships и поместит в массив shipsPlayer1
            такая вещь нужна в случае, если нужно скопировать массив и добавить в него еще элементы (через запятую в [])
            также с объектами {...ships, newElement, newElement: f} */
            ships = [];
            for (const button in buttons) { // 3
                buttons[button].elements = 0;
                buttons[button].button.disabled = false;
            }
        } else { // 4
            box = player1;
            shipsPlayer2 = [...ships];
            ships = null;
            generateBox(player2Cover);
            player2Cover.style.display = 'flex';
            boxConteiner.classList.remove('box-reverse');
            blockButtons();
            readyButton.disabled = true;
            readyButton.classList.add('visibility');
            modalWindow(player1Cover);
        }
    })

    
}

/**
 * 
 * @param {HTMLElement} box - скрывающее поле
 * 1) показывает модальное окно "Готов ли игрок?"
 * 2) после нажатия "ДА! "убирает скрывающее поле с поля активного игрока 
 */
function modalWindow(box) {
    document.getElementById('modal-p').textContent = box == player1Cover ? 'Игрок 1 готов?' : 'Игрок 2 готов?';
    document.getElementsByClassName('modal-conteiner')[0].style.display = 'flex'; // 1
    readyPlayerButton.addEventListener('click', ()=>{ // 2
        document.getElementsByClassName('modal-conteiner')[0].style.display = 'none';
        box.childNodes.forEach((cell)=>{
            cell.style.background = 'none';
        })
    })
}

init();