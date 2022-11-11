## Installation
This is a custom browser script that adds navigation shortcuts in the New York Times crossword webapp. It is compatible with GreaseMonkey and TamperMonkey for Firefox and Chrome, respectively.

To install, create a new script through the extension settings and copy-and-paste the contents of script.js into it. The script is configured to only be active when you have a crossword open.

## Usage
This script works by intercepting keyboard events of numbers and symbols that you probably wouldn't want to insert into your board. When you type one such character, then this script will fire fake keyboard events and mouse events, interacting with the page as if you had done it manually.

Some commands only work if you go to your New York Times Crossword settings and change "space" to "Toggle between Across and Down".

The biggest command added is probably /<Enter/> with a number before it. If you type 45/<Enter/> then your cursor will jump to the clue label 45. You go to Across mode automatically, unless there is only a clue going Down at that label.

|command|description|
|---|---|
|.      |move forward  without clearing.|
|,      |move backward without clearing.|
|'      |move cursor to the right in down mode and down in across mode.|
|;      |move cursor to the left  in down mode and up   in across mode.|
|0      |go to beginning of word.|
|1-9    |type to select a clue to jump to.|
|ENTER  |if any clue is selected, jump to that clue. otherwise use default behavior.|
|DELETE |works like backspace but goes forward|

If you ever want to bypass this script, for example to insert a "2" onto your board, you can. Just press /<Escape/> to go into Rebus mode, where you can type the character normally and press /<Escape/> again to get out of it.
