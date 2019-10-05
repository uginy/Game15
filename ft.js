const game = {
  size: 15,
  counter: 0,
  timer: new Date().getSeconds(),
  counterId: document.getElementById('counter'),
  but: document.getElementById('button'),

  counterIncrement() {
    this.counterId.innerText = 'Steps: ' + this.counter;
    return this.counter;
  },

  board: document.getElementById('board'),

  randomArr(size) {
    const tempArr = [];
    for (let i = 0; i < size; i++) tempArr[i] = i + 1;
    return tempArr.sort((a, b) => 0.5 - Math.random());
  },

  createCell(id, txt, cls) {
    const cell = document.createElement('div');
    cell.classList.add(cls);
    cell.innerText = txt;
    cell.setAttribute('id', id);
    this.board.append(cell);
  },

  swapNodes(obj1, obj2) {
    var temp = document.createElement('div');
    obj1.parentNode.insertBefore(temp, obj1);
    obj2.parentNode.insertBefore(obj1, obj2);
    temp.parentNode.insertBefore(obj2, temp);
    temp.parentNode.removeChild(temp);
    game.checkGameResult();
  },

  checkGameResult: () => {
    let status = [];
    Object.entries(this.board.children).forEach(([key, value]) => {
      let keyin = +key + 1;
      let idd = document.getElementById(value.id);
      if (keyin == +value.id) {
        status[key] = true;
        idd.innerText = '(' + +value.id + ')';
      } else {
        if (value.id !== 'empty') {
          idd.innerText = value.id;
        } else {
          idd.innerText = '';
          status[key] = false;
        }
        status[key] = false;
      }
    });
    //console.log(status, status.indexOf(false));
    if (status.indexOf(false) === game.size)
      document.getElementById('empty').innerText = 'WIN';
  },

  addEffect: (obj, d) => {
    obj.classList.remove('anim_left', 'anim_up', 'anim_down', 'anim_right');
    switch (d) {
      case 1:
        obj.classList.add('anim_right');
        break;
      case -1:
        obj.classList.add('anim_left');
        break;
      case 4:
        obj.classList.add('anim_up');
        break;
      case -4:
        obj.classList.add('anim_down');
        break;
      default:
        break;
    }
  },

  isMovable(obj, id) {
    const empty = document.getElementById('empty');
    const index = [...obj.parentNode.children].indexOf(obj);
    const indexE = [...empty.parentNode.children].indexOf(empty);
    const diffAbs = Math.abs(index - indexE);
    const diff = index - indexE;
    game.checkGameResult();
    if ((index + 1) % 4 === 0 && indexE % 4 === 0) return false;
    if (index % 4 === 0 && (indexE + 1) % 4 === 0) return false;
    if (diffAbs !== 1 && diffAbs !== 4) return false;
    else {
      game.counter++;
      game.counterIncrement();
      this.addEffect(obj, diff);
      this.addEffect(empty, -diff);
      return true;
    }
  },

  createSwapEffect(index) {
    this.board.childNodes[index].addEventListener(
      'click',
      function() {
        const node1 = document.getElementById(this.id);
        const node2 = document.getElementById('empty');
        game.isMovable(node1, this.id) && game.swapNodes(node1, node2);
      },
      false
    );
  },

  fillCells() {
    const arr = this.randomArr(game.size);
    arr.push(15);
    for (let i = 0; i < this.size; i++) {
      this.createCell(arr[i], arr[i], 'cell');
      this.createSwapEffect(i);
    }
    game.checkGameResult();
  },

  start() {
    this.but.onclick = () => {
      if (confirm('Refresh the Game?')) return this.start();
    };
    this.counterId.innerText = 'Steps: ' + this.counter;
    this.board.innerHTML = ''; // clear old stuff befor start
    this.fillCells(); // fill regular cells
    this.createCell('empty', '', 'empty'); // add empty cell
  }
};

window.onload = () => game.start();
// window.onbeforeunload = () => 'Refresh???';
