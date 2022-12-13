document.onreadystatechange = function () {
    "use strict";
    
    function BGrandom() {
        var rand = Math.floor(Math.random() * 5) + 1;
        var folderName = ['ayaka','klee','layla','nahida','raiden']

        var url = "url('assets/" + folderName[rand-1] + ".png')";
        var tile = document.querySelectorAll('.puzzlepiece');
        for(var i = 0; i < tile.length; i++) {
              tile[i].style.backgroundImage = url;
        }
    }
    document.body.onload = function() {
        BGrandom();
    };
    
    function BGsetup() {
        var bC = document.querySelector("#dropdown").value;
        var tile = document.querySelectorAll('.puzzlepiece');
    
        for(var i = 0; i < tile.length; i++) {
              tile[i].style.backgroundImage = bC;
        }
        console.log(bC);
    }
    
    if (document.readyState == "complete") {
        var grid =  [[0,0,false],[100,0,false],[200,0,false],[300,0,false],
                   [0,100,false],[100,100,false],[200,100,false],[300,100,false],
                   [0,200,false],[100,200,false],[200,200,false],[300,200,false],
                   [0,300,false],[100,300,false],[200,300,false],[300,300,true]];

        var puzzleAreaContents = document.querySelector("#puzzlearea").children;
        var shuffleTrack = 0;
        var movesCount = 0;
        var pressCount = 0;
        var finishMin = 0;
        var finishSec = 0;

        // put the timer
        document.querySelector("#main-of-page").insertAdjacentHTML('beforeend', "Number of moves: <span id='movesCount'>0</span>");
        document.querySelector("#main-of-page").insertAdjacentHTML('beforeend', "<br>Timer: <label id='minutes'>00</label>:<label id='seconds'>00</label><br>");

        function doucheck() {
            var check = "";
            var arr = document.querySelector("#puzzlearea").children;
            for (var i = 0; i < arr.length; i++) {
                check = check + arr[i].innerHTML
            };
            if (check == "123456789101112131415" && movesCount > 20) {
                finishSec = pad(totalSeconds % 60);
                finishMin = pad(parseInt(totalSeconds / 60));
                celebrate();
                return true;
            }
        }

        function celebrate() {
            document.querySelector("#p1").style.display = "none";
            document.querySelector("#p2").style.display = "none";
            document.querySelector("#w3c").style.display = "none";
            document.querySelector("form").style.display = "none";
            document.querySelector("#puzzlearea").innerHTML = `<div><img onclick='location.reload();'src='assets/congrats.gif'/></div>`+
                                                                `<h1 onclick='location.reload();'>YOU DID IT!!!</h1>`+
                                                                "<p>You completed the game with " + movesCount + " moves in " + finishMin + ":" + finishSec + "</p>";
            document.querySelector("#shufflebutton").outerHTML = "";
            document.querySelector("#win").style.display = "";
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
            movesCount = movesCount + 1; 
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

            if (doucheck() == true) {return;} 
            
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
            document.querySelector("#puzzlearea").innerHTML = document.querySelector("#puzzlearea").innerHTML + "<div class='empty'></div>";
            addEventListeners(getArrayOfMovableCells());
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

// demo
var canvas = document.querySelector('#canvas'),
		ctx = canvas.getContext( '2d' ),
		cw = window.innerWidth,
		ch = window.innerHeight,
		fireworks = [],
		particles = [],
		hue = 120,
		limiterTotal = 5,
		limiterTick = 0,
		timerTotal = 80,
		timerTick = 0,
		mousedown = false,
		mx,
		my;
canvas.width = cw;
canvas.height = ch;
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}
function Firework( sx, sy, tx, ty ) {
	this.x = sx;
	this.y = sy;
	this.sx = sx;
	this.sy = sy;
	this.tx = tx;
	this.ty = ty;
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	this.coordinates = [];
	this.coordinateCount = 3;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	this.targetRadius = 1;
}

Firework.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	
	this.speed *= this.acceleration;
	
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		fireworks.splice( index, 1 );
	} else {
		this.x += vx;
		this.y += vy;
	}
}

Firework.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();	
	ctx.beginPath();
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}
function Particle( x, y ) {
	this.x = x;
	this.y = y;
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	this.friction = 0.95;
	this.gravity = 1;
	this.hue = random( hue - 50, hue + 50 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	this.decay = random( 0.015, 0.03 );
}

Particle.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

Particle.prototype.draw = function() {
	ctx. beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}

function createParticles( x, y ) {
	var particleCount = 30;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

function loop() {
    requestAnimFrame( loop );
	hue= random(0, 360 );
	
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}
	
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );
	}
	
	if( timerTick >= timerTotal ) {
		if( !mousedown ) {
			fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
			timerTick = 0;
		}
	} else {
		timerTick++;
	}
	
	if( limiterTick >= limiterTotal ) {
		if( mousedown ) {
			fireworks.push( new Firework( cw / 2, ch, mx, my ) );
			limiterTick = 0;
		}
	} else {
		limiterTick++;
	}
}

canvas.addEventListener( 'mousemove', function( e ) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener( 'mousedown', function( e ) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});

window.onload = loop;

