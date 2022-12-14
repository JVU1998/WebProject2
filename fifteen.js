document.onreadystatechange = function () {
    "use strict";
    function BGrandom() {
        var rand = Math.floor(Math.random() * 5) + 1;
        var folderName = ['ayaka','klee','layla','nahida','raiden']

        var url = "url('assets/" + folderName[rand-1] + ".png')";
        document.getElementById('dropdown').value = url;
        var tile = document.querySelectorAll('.puzzlepiece');
        for(var i = 0; i < tile.length; i++) {
              tile[i].style.backgroundImage = url;
        }
    }

    function BGsetup() {
        var bC = document.querySelector("#dropdown").value;
        var tile = document.querySelectorAll('.puzzlepiece');
    
        for(var i = 0; i < tile.length; i++) {
              tile[i].style.backgroundImage = bC;
        }
    }

    document.body.onload = function() {
        BGrandom();
    };
    
    if (document.readyState == "complete") {
        var grid =  [
                [0,0,false],  [100,0,false],  [200,0,false],  [300,0,false],
                [0,100,false],[100,100,false],[200,100,false],[300,100,false],
                [0,200,false],[100,200,false],[200,200,false],[300,200,false],
                [0,300,false],[100,300,false],[200,300,false],[300,300,true]
            ];

        var puzzleAreaContents = document.querySelector("#puzzlearea").children;
        var shuffleTrack = 0;
        var movesCount = 0;
        var pressCount = 0;
        var finishMin = 0;
        var finishSec = 0;

        // document.querySelector("#main-of-page").insertAdjacentHTML('beforeend', "Number of moves: <span id='movesCount'>0</span>");
        // document.querySelector("#main-of-page").insertAdjacentHTML('beforeend', "<br>Timer: <label id='minutes'>00</label>:<label id='seconds'>00</label><br>");

        function docheck() {
            var check = "";
            var arr = document.querySelector("#puzzlearea").children;
            for (var i = 0; i < arr.length; i++) {
                check = check + arr[i].innerHTML
            };
            if (check == "123456789101112131415" && movesCount > 20) {
                finishSec = pad(totalSeconds % 60);
                finishMin = pad(parseInt(totalSeconds / 60));
                complete();
                return true;
            }
        }

        function complete() {
            document.querySelector("#p1").style.display = "none";
            document.querySelector("#p2").style.display = "none";
            document.querySelector("#w3c").style.display = "none";
            document.querySelector("form").style.display = "none";
            document.querySelector("#puzzlearea").innerHTML = `<div><img onclick='location.reload();'src='assets/congrats.gif'/></div>`+
                                                                `<h1 onclick='location.reload();'>YOU DID IT!!!</h1>`+
                                                                "<p>You completed the game with " + movesCount + " moves in " + finishMin + ":" + finishSec + "</p>";
            document.querySelector("#shufflebutton").outerHTML = "";
            document.querySelector("#win").style.display = "";
            document.querySelector("#gameStats").style.display = "none";
            document.querySelector("#restart").style.display = "block";

        }

        function shuffle(shuffleTrack) {
            var randomNum = getRandomElement();
            shiftPuzzlePiece.call(puzzleAreaContents[randomNum]);
            if (shuffleTrack < 199) { 
                shuffleTrack = shuffleTrack + 1;
                shuffle(shuffleTrack);
            } else { // reset
                shuffleTrack = 0;
                movesCount = 0; 
                document.querySelector("#movesCount").innerHTML = movesCount;          
            }
        }

        var minutes = document.querySelector("#minutes");
        var seconds = document.querySelector("#seconds");
        var totalSeconds = 0;

        function setTime() {
            ++totalSeconds;
            seconds.innerHTML = pad(totalSeconds % 60);
            minutes.innerHTML = pad(parseInt(totalSeconds / 60));
        }

        function pad(val) {
            var valString = "" + val;
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        }

        function playSound() {
            var audio = new Audio("assets/music.mp3");
            audio.play();
            setTimeout(playSound, 121000);
        }

        function getRandomElement() {
            var moveCanMake = getArrayOfMovableCells();
            return moveCanMake[Math.floor(Math.random() * moveCanMake.length)];
        }

        function openBlock() {
            for (var i = 0; i < grid.length; i++) {
                if (grid[i][2] == true){return i;}
            }
        }

        function getArrayOfMovableCells() {
            var open = openBlock();
            var moveCanMake = [open-4, open-1, open+1, open+4];
            var count = moveCanMake.length;
            
            for (var i = 0; i < count; i++) {
                if (moveCanMake[i] < 0) { 
                    moveCanMake[i] = null;
                }            
                if (moveCanMake[i] > 15) { 
                    moveCanMake[i] = null;
                }
                if (open == 3 || open == 7 || open == 11 ) {  
                    moveCanMake[moveCanMake.indexOf(open+1)] = null;
                }
                if (open == 4 || open == 8 || open == 12 ) { 
                    moveCanMake[moveCanMake.indexOf(open-1)] = null;
                }
            }
            moveCanMake = moveCanMake.filter(function(val) { return val !== null; })
            return moveCanMake;
        }
        
        function addPuzzlePieceHover() {
            this.className = this.className + " puzzlepiecehover";
        }
        function removePuzzlePieceHover() {
            this.className = "puzzlepiece";
        }
        function shiftPuzzlePiece() {
            movesCount++; 
            document.querySelector("#movesCount").innerHTML = movesCount; 

            this.style.left = grid[openBlock()][0]+"px";
            this.style.top = grid[openBlock()][1]+"px";
            
            this.className = "puzzlepiece";

            var collection = Array.prototype.slice.call( puzzleAreaContents );
            var movedBlock = collection.indexOf(this);
            var openBlockIndex = collection.indexOf(puzzleAreaContents[openBlock()]);
        
            var switchVariable = collection[movedBlock];
            collection[movedBlock] = collection[openBlockIndex];
            collection[openBlockIndex] = switchVariable;

            document.querySelector("#puzzlearea").innerHTML = "";
            for (var i = 0; i < collection.length; i++) {
                document.querySelector("#puzzlearea").innerHTML = document.querySelector("#puzzlearea").innerHTML 
                                                                    + collection[i].outerHTML;
            }
            
            grid[openBlock()][2] = false;
            grid[movedBlock][2] = true;
            
            removeEventListeners(getArrayOfMovableCells()); 

            if (docheck() == true) {return;} 
            
            addEventListeners(getArrayOfMovableCells()); 
        }

        function addEventListeners(moveCanMake) {
            for (var i = 0; i < moveCanMake.length; i++) {
                puzzleAreaContents[moveCanMake[i]].addEventListener("mouseover", addPuzzlePieceHover, false);
                puzzleAreaContents[moveCanMake[i]].addEventListener("mouseout", removePuzzlePieceHover, false);
                puzzleAreaContents[moveCanMake[i]].addEventListener("click", shiftPuzzlePiece);
            }
        }

        function removeEventListeners(moveCanMake) {
            for (var i = 0; i < moveCanMake.length; i++) {
                puzzleAreaContents[moveCanMake[i]].removeEventListener("mouseover", addPuzzlePieceHover, false);
                puzzleAreaContents[moveCanMake[i]].removeEventListener("mouseout", removePuzzlePieceHover, false);
                puzzleAreaContents[moveCanMake[i]].removeEventListener("click", shiftPuzzlePiece, false);
            }
        }

        function initializePuzzleArea() {
            var x = 0;
            var y = 0;

            for (var i = 0; i < puzzleAreaContents.length; i++) {
                puzzleAreaContents[i].setAttribute("class", "puzzlepiece");
                puzzleAreaContents[i].style.top = y+"px" ;
                puzzleAreaContents[i].style.left = x+"px" ;
                puzzleAreaContents[i].style.backgroundPosition = "-" + x + "px " + "-" + y + "px";
                
                if (x == 300) {
                    var y = y + 100; 
                    var x = 0; 
                } else {
                    var x = x + 100;
                }
            }
            document.querySelector("#puzzlearea").innerHTML = document.querySelector("#puzzlearea").innerHTML + "<div></div>";
        }
        document.querySelector("#dropdown").onchange = function(){
            BGsetup();
        }

        document.querySelector("#shufflebutton").onclick = function(){
            pressCount++;
            if(pressCount == 1) {
                setInterval(setTime, 1000);
                playSound();
            }
            shuffle(shuffleTrack);
        }
        document.getElementById('restartBtn').addEventListener('click', ()=>location.reload());
        initializePuzzleArea();
    }
}


window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();