// ==UserScript==
// @name         NYTXW easy keyboard navigation
// @version      0.2
// @description  Type a clue number then press enter to jump to it, and more! (see source)
// @author       chase
// @match        https://www.nytimes.com/crosswords/game/*
// ==/UserScript==

/********
Important: set space to "Toggle between Across and Down" in crossword settings.
If you want to put any of the following commands in the puzzle board itself (probably a digit), you can
enter rebus mode by pressing escape. Then enter your character and press enter to get out of rebus mode.

To customize some of the default bindings, change the constants just below this multiline comment.

.      move forward  without clearing.
,      move backward without clearing.
'      move cursor to the right in down mode and down in across mode.
;      move cursor to the left  in down mode and up   in across mode.
0      go to beginning of word.
1-9    type to select a clue to jump to.
ENTER  if any clue is selected, jump to that clue. otherwise use default behavior.
DELETE works like backspace but goes forward
********/

const PREV_1 = ',';
const PREV_2 = '<';
const NEXT_1 = '.';
const NEXT_2 = '>';
const HOP_PREV_1 = ';';
const HOP_PREV_2 = ':';
const HOP_NEXT_1 = "'";
const HOP_NEXT_2 = '"';
// The digits, enter key, and delete can't be so easily changed

var selector = '';
var labels = [];
var franklin;

// trigger a keydown event. defaults to SPACE being typed.
function keydown(key) {
  franklin.dispatchEvent(new KeyboardEvent('keydown', {key: key, bubbles: true}));
}

function isAcross() {
  return document.getElementsByClassName('xwd__clue-bar-desktop--number')[0].textContent.endsWith('A');
}

function isCursorEmpty() {
  var children = document.getElementsByClassName('xwd__cell--selected')[0].parentElement.children;
  return children[children.length - 1].textContent == '';
}

function nextCell() {
  keydown(isAcross() ? 'ArrowRight' : 'ArrowDown');
}

function prevCell() {
  keydown(isAcross() ? 'ArrowLeft' : 'ArrowUp');
}

function goToStartOfWord() {
  document.getElementsByClassName('xwd__clue--selected')[0].click();
}

function goToSelectedClue() {
  if (!labels.length) {
    labels = document.getElementsByClassName('xwd__clue--label');
  }

  for (let i in labels) {
    if (labels[i].textContent == selector) {
      labels[i].click();
      break;
    }
  }

  selector = '';
}

function handleUserKey(evt) {
  console.log(evt.key);

  // allow the user to type whatever if they hold command or control. so the user can use keyboard shortcuts like cmd-2
  if (evt.metaKey || evt.ctrlKey) {
    return;
  }

  // allow the user to input whatever they want on the puzzle board, including digits and symbols, via rebus mode
  if (document.activeElement.id == 'rebus-input') {
    return;
  }

  // clear the CLUE SELECTOR REGISTER if this keydown does not add to it or use it
  if ((evt.key < '0' || evt.key > '9') && evt.key != 'Enter') {
    selector = '';
  }

  // now execute any custom behavior, if any!
  switch(evt.key) {
    case PREV_1:
    case PREV_2:
      prevCell();
      break;

    case NEXT_1:
    case NEXT_2:
      nextCell();
      break;

    case HOP_PREV_1:
    case HOP_PREV_2:
      keydown(' ');
      prevCell();
      keydown(' ');
      break;

    case HOP_NEXT_1:
    case HOP_NEXT_2:
      keydown(' ');
      nextCell();
      keydown(' ');
      break;

    case '0':
      // either jump to beginning of word or add on to selector like the other digits
      if (selector == '') {
        goToStartOfWord();
      }
      else {
        selector += '0';
      }
      break;

    case '1': case '2': case '3':case '4': case '5': case '6': case '7': case '8': case '9':
      selector += evt.key;
      break;

    // for some reason, default behavior of 'Enter' is not blocked by preventDefault(). For this reason,
    // we set a timeout to execute goToSelectedClue only after the default behavior has executed and can't mess it up
    case 'Enter':
      setTimeout(goToSelectedClue);
      break;

    // same as 'Enter', default behavior is not blocked! Therefore, we only worry about moving the cursor
    // and deleting the text itself is handled for us. Default behavior of delete simply clears the cursor.
    case 'Delete':
      if (isCursorEmpty()) {
        nextCell();
      }
      break;

    // prevent preventing (allow to) the character from going on the puzzle board
    default:
      return;
  }

  // prevent the character from going on the puzzle board
  evt.preventDefault();
}

function startListening() {
  franklin = document.getElementsByClassName('xwd__franklin')[0];

  if (!franklin) {
    setTimeout(startListening);
    return;
  }

  franklin.addEventListener('keydown', handleUserKey);
  console.log('Custom command listener ready');
}
startListening();
