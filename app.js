class Course {
    constructor(size, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
        this.map = [];
        this.coords = [];
        this.ball = {};
    }

    getCell(posX, posY) {
        if(posX >= this.size || posX <= -1 || posY >= this.size || posY <= -1) {
            // console.log('Tried to get cell out of range')
            return false; 
        } else {
            // console.log(`Pulled (${posX}, ${posY}).`)
            return this.map.find( (cell) => (cell.coord.x == posX && cell.coord.y == posY));
        }
    }

    getCellNeighbors2(cell) {
        // same functionality, but different implementation
        let neighbors = [];
        let posX = cell.coord.x;
        let posY = cell.coord.y;
        // currently pushing false values
        // right
        neighbors.push(course.getCell(posX+1, posY));
        // bottom-right
        neighbors.push(course.getCell(posX+1, posY-1));
        // bottom
        neighbors.push(course.getCell(posX, posY-1));
        // bottom-left
        neighbors.push(course.getCell(posX-1, posY-1));
        // left
        neighbors.push(course.getCell(posX-1, posY));
        // top-left
        neighbors.push(course.getCell(posX-1, posY+1));
        // top
        neighbors.push(course.getCell(posX, posY+1)); 
        // top-right
        neighbors.push(course.getCell(posX+1, posY+1)); 

        return neighbors.filter((item) => item);
    }
}

class Cell {
    constructor(course, terr, posX, posY) {
        this.course = course;
        this.terr = terr;
        this.posX = posX;
        this.posY = posY;
        this.hasBall = false;
        this.path = false;
        this.coord = {x: posX, y: posY};        
    }

    getCellNeighbors() {
        // Includes diagonal neighbors
        let neighbors = [];
        if(this.course.getCell(this.posX+1, this.posY))     {neighbors.push(this.course.getCell(this.posX+1,   this.posY))};
        if(this.course.getCell(this.posX+1, this.posY-1))   {neighbors.push(this.course.getCell(this.posX+1,   this.posY-1))};
        if(this.course.getCell(this.posX,   this.posY-1))   {neighbors.push(this.course.getCell(this.posX,     this.posY-1))};
        if(this.course.getCell(this.posX-1, this.posY-1))   {neighbors.push(this.course.getCell(this.posX-1,   this.posY-1))};
        if(this.course.getCell(this.posX-1, this.posY))     {neighbors.push(this.course.getCell(this.posX-1,   this.posY))};
        if(this.course.getCell(this.posX-1, this.posY+1))   {neighbors.push(this.course.getCell(this.posX-1,   this.posY+1))};
        if(this.course.getCell(this.posX,   this.posY+1))   {neighbors.push(this.course.getCell(this.posX,     this.posY+1))};
        if(this.course.getCell(this.posX+1, this.posY+1))   {neighbors.push(this.course.getCell(this.posX+1,   this.posY+1))};
        return neighbors;
    }

    changeTerrain(newTerr) {
        this.terr = newTerr;
    }

    propagate(chance) {
        // Recursive. Currently finds neighbors that have already been transformed which is potentially wasteful
        if(chance <= 0) {
            return;
        } else {
            this.changeTerrain('sand');
            let neighbors = this.getCellNeighbors();
            for(let neighbor of neighbors) {
                let rand = Math.random();
                if(rand < chance) {
                    neighbor.changeTerrain('sand');
                    neighbor.propagate(chance-0.30);
                    // console.log(neighbor);
                }

            }
        }

    }
}

class Ball {
    // can make own div w/ absolute positioning?
    constructor(course, posX, posY) {   
        this.course = course;
        this.cell = this.course.getCell(posX, posY);
        this.cell.hasBall = true;
        this.posX = posX;
        this.posY = posY;
        this.velX = 0;
        this.velY = 0;
        this.coord = {x: posX, y: posY}
        this.path = [];

        // this.angleFromBall = 0;
    }
    
    findNewPos(power, angle, oldCell) {
        let angleRadians = degreesToRadians(angle);
        let newX = Math.floor(power * Math.cos(angleRadians)) + oldCell.posX;
        let newY = Math.floor(power * Math.sin(angleRadians)) + oldCell.posY;
        return this.course.getCell(newX, newY);
    }

    updatePos(newCell) {
        this.posX = newCell.posX;
        this.posY = newCell.posY;
        this.cell = this.course.getCell(this.posX, this.posY);
        this.cell.hasBall = true;
        this.coord = {x: newCell.posX, y: newCell.posY};
        
        updateCourseHTML(this.course);
    }

    hit(power, angle) { 
        // Only works if HTML has been rendered.
        let currCell = this.cell;
        let currCellHTML = document.getElementById('x' + this.cell.posX + 'y' + this.cell.posY);
        currCellHTML.classList.remove('ball');
        this.cell.hasBall = false;
        let newCell = this.findNewPos(power, angle, currCell);
        console.log(newCell);
        this.path = interpolatePath(this.course, generatePath(this.course, currCell, newCell));
        generatePathHTML(this.path);
        this.move();
        // let newX = newCell.posX;
        // let newY = newCell.posY;
        // let newCellHTML = document.getElementById('x' + newX + 'y' + newY);
        // newCellHTML.classList.add('ball');
        // return this.updatePos(newCell);
    }

    move() {
        // Doesn't currently accept path of 1;
        for(let i = 1; i < this.path.length; i++){
            let counter = i;
            let cellHTML = document.getElementById('x' + this.path[i].posX + 'y' + this.path[i].posY);
            let prevCellHTML = document.getElementById('x' + this.path[i-1].posX + 'y' + this.path[i-1].posY);
            
            this.path[i].hasBall = true;
            this.path[i-1].hasBall = false;
            cellHTML.classList.add('ball');

            prevCellHTML.classList.add('path');
            prevCellHTML.classList.remove('ball');
            
            this.updatePos(this.path[i]);
        }
        
        return this.path = [];
    }
}

class Hole {
    // make sure neighbors.len = 8;
    constructor(course, posX, posY) {
        this.course = course;
        this.cell = this.course.getCell(posX, posY)
        this.posX = posX;
        this.posY = posY;
        this.area = this.cell.getCellNeighbors();
    }
}

const generateCourse = (size, difficulty) => {
    let course = new Course( size, difficulty );
    // y coord
    for(let i = 0; i < size; i++) {
        // x coord
        for(let j = 0; j < size; j++) {
            let newCell = new Cell(course, 'grass', j, i);
            course.map.push(newCell);
            course.coords.push([newCell.posX, newCell.posY]);
        }
    }
    // hazards
    let cell = course.getCell(Math.floor(Math.random() * size), Math.floor(Math.random() * size));
    let cell2 = course.getCell(Math.floor(Math.random() * size), Math.floor(Math.random() * size));
    let cell3 = course.getCell(Math.floor(Math.random() * size), Math.floor(Math.random() * size));
    cell.propagate(1);
    cell2.propagate(0.65);
    cell3.propagate(0.85);

    // ball
    let ball = new Ball(course, size-(size-3), size-(size-3));
    course.ball = ball;

    return course;
}

const generateCourseHTML = (course) => {
    const gameContainer = document.getElementById('game-container');
    const courseContainer = document.createElement('div');
    courseContainer.classList.add('course');
    gameContainer.appendChild(courseContainer)

    for(let cell of course.map) {
        let htmlCell = document.createElement('div');
        htmlCell.id = 'x' + String(cell.posX) + 'y' + String(cell.posY);
        htmlCell.classList.add(cell.terr)
        htmlCell.classList.add('cell')

        htmlCell.addEventListener("mouseover", (e) => {
            // find angle between mouseover cell and ball cell
            let ballCell = course.ball.cell; 
            let angle = Math.floor(angleBtwnCells(ballCell, cell));
            console.log(angle);
            
        })


        if(cell.hasBall){
            htmlCell.classList.add('ball');
        }
        courseContainer.appendChild(htmlCell);
    }
    return courseContainer;
}

const updateCourseHTML = (course) => {
    let gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    return generateCourseHTML(course);
}

const generatePath = (course, cell1, cell2) => {
    // Returns list of coordinate points, _not_ cells.
    let path = [];
    let slope = (cell2.posY - cell1.posY) / (cell2.posX - cell1.posX);
    console.log(`Slope is ${slope}`)
    let y = slope*cell1.posX;
    let b = cell1.posY - slope * cell1.posX;
    console.log(`The equation of the line is y = ${slope}x + ${b}`)
    let dx = cell2.posX - cell1.posX;
    let dy = cell2.posY - cell1.posY;

    if(slope == Infinity){
        for(let i = 1; i < dy; i++) {
            path.push([cell1.posX, cell1.posY + i ])
        }
    } else {
        if(dx > 0 && dy > 0) {
            for(let i = 0; i < dx+1; i++) {
                let stepX = i + cell1.posX;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push(course.getCell(stepX, stepY));
                } else {
                    let stepY = Math.floor(slope*stepX + b);
                    path.push(course.getCell(stepX, stepY));
                }
            }
        }

        if(dx < 0 && dy > 0) {
            console.log('dx < 0, dy > 0')
            for(let i = cell1.posX; i > cell2.posX-1; i--) {
                let stepX = i;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push(course.getCell(stepX, stepY));
                } else {
                    let stepY = Math.ceil(slope*stepX + b);
                    path.push(course.getCell(stepX, stepY));
                }
            }
        }

        if(dx > 0 && dy < 0){
            for(let i = 0; i < dx; i++) {
                let stepX = i + cell1.posX;
                if(slope % 1 ==0){
                    let stepY = slope*stepX + b;
                    path.push(course.getCell(stepX, stepY));
                } else {
                    let stepY = Math.floor(slope*stepX + b);
                    path.push(course.getCell(stepX, stepY));
                }

            }
        }
         if(dx < 0 && dy < 0) {
            for(let i = cell1.posX; i > cell2.posX-1; i--) {
                let stepX = i;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push(course.getCell(stepX, stepY));
                } else {
                    let stepY = Math.ceil(slope*stepX + b);
                    path.push(course.getCell(stepX, stepY));
                }
            }
        }
    }
    for(let cell of path){
        course.getCell(cell.posX, cell.posY).path = true;
    }
    return path;
}

const interpolatePath = (course, path) => {
    if(path.length <= 1) {
        return path;
    }
    // Takes an array of cells.
    let newPath = [];
    // for dx > 0 and dy > 0
    let startX = path[0].posX;
    let startY = path[0].posY;
    let endX = path[path.length-1].posX
    let endY = path[path.length-1].posY

    let dx = endX - startX;
    let dy = endY - startY;
   
    if((endY - startY) / (endX - startX) == 1 || (endY - startY) / (endX - startX) == -1) {
        console.log('Path is straight. There is nothing to interpolate.')
        return path;
    } 
    // tested: works;
    if(dx > 0 && dy > 0) {
        for(let i = 1; i < path.length; i++) {
            newPath.push(path[i-1]);
            let startX = path[i-1].posX;
            let startY = path[i-1].posY;
            let endX = path[i].posX;
            let endY = path[i].posY;
            let dy = endY - startY;

            for(let j=1; j < dy+1; j++) {
                newPath.push(course.getCell(startX+1, startY+j))
            }
        }
    }
    // tested: works
    if(dx < 0 && dy > 0) {
        for(let i = 1; i < path.length; i++) {
            newPath.push(path[i-1]);
            
            let startX = path[i-1].posX;
            let startY = path[i-1].posY;
            let endX = path[i].posX;
            let endY = path[i].posY;
            let dy = endY - startY;

            for(let j=1; j < dy+1; j++) {
                newPath.push(course.getCell(startX-1, startY+j));
            }
        }
    }
    // tested: works
    if(dx > 0 && dy < 0) {
            console.log('dx > 0 and dy < 0 running')
            for(let i = 1; i < path.length; i++) {
                newPath.push(path[i-1]);
                let startX = path[i-1].posX;
                let startY = path[i-1].posY;
                let endX = path[i].posX;
                let endY = path[i].posY;
                let dy = endY - startY;

                for(let j=1; j > dy+1; j--) {
                    newPath.push(course.getCell(startX+1, startY-j));
                }
            }
        }
     if(dx < 0 && dy < 0) {
            for(let i = 1; i < path.length; i++) {
                newPath.push(path[i-1]);
                let startX = path[i-1].posX;
                let startY = path[i-1].posY;
                let endX = path[i].posX;
                let endY = path[i].posY;
                let dy = endY - startY;

                for(let j=1; j > dy+1; j--) {
                    console.log('j running')
                    newPath.push(course.getCell(startX-1, startY-j));
                }
            }
        }
    // currently returns with repeats
    return newPath;
}

const generatePathHTML = (path) => {
    for(let cell of path){
        let cellHTML = document.getElementById('x' + cell.posX + 'y' + cell.posY);
        console.log(cellHTML);
        cellHTML.classList.add('path');
    }
}

const extractPosFromId = (id) => {
    // Takes the ID format 'x#y#' where # can be any number of integers and returns an {x, y} coord object.
    let pos = {};
    let splitId = id.split('');
    let indexX = splitId.indexOf('x');
    let indexY = splitId.indexOf('y');
    let xCoord = id.substring(indexX+1, indexY);
    let yCoord = id.substring(indexY+1, id.length);
    pos.x = xCoord;
    pos.y = yCoord 
    pos.push(yCoord);
    return pos;
}

const resetBall = (ball) => {
    // In out of bounds situaitons
}

const generateUI = (course) => {
}

let makeCourseBtn = document.getElementById('make-course-btn');
makeCourseBtn.addEventListener("click", () => {
    const course = generateCourseHTML(generateCourse(30,2));
    course.style.gridTemplateColumns = 'repeat(30, 1fr)';
    course.style.gridTemplaterows = 'repeat(30, 1fr)';
})


// testing
// course size = testingSize x testingSize;
// const testingSize = 50;
// for(let i = 0; i < 1; i++) {
//     // course generation
//     let course = generateCourse(testingSize,1);
//     let cell = course.getCell(Math.floor(Math.random() * testingSize), Math.floor(Math.random() * testingSize));
//     let cell2 = course.getCell(Math.floor(Math.random() * testingSize), Math.floor(Math.random() * testingSize));
//     cell.propagate(0.90);
//     cell2.propagate(0.90);

//     // console output
//     let output = [];
//     let counter = 0;
//     for(let i = 0; i < testingSize; i++) {
//         let line = '';
//         for(let j = 0; j < testingSize; j++) {
//             course.map[counter].terr == 'grass' ? line += '🟩' : line += '🟨';
//             counter += 1;
//         }
//         output.unshift(line)
//         line = '';
        
//     }
//         console.log('Course #' + (Number(i) + 1) + ':')
//         for(let i of output){
//             console.log(i)
            
//         }
//         console.log('--------------------')
    
//     generateCourseHTML(course);
// }


// setInterval();
// velocity x, velocity y - sin of angle, cosign of angle?
// Course builder

// const getNeighbors = (course, cell) => {
//     let neighbors = [];
//     let posX = cell.coord.x;
//     let posY = cell.coord.y;
//     // right
//     neighbors.push(course.getCell(posX+1, posY));
//     // bottom-right
//     neighbors.push(course.getCell(posX+1, posY-1));
//     // bottom
//     neighbors.push(course.getCell(posX, posY-1));
//     // bottom-left
//     neighbors.push(course.getCell(posX-1, posY-1));
//     // left
//     neighbors.push(course.getCell(posX-1, posY));
//     // top-left
//     neighbors.push(course.getCell(posX-1, posY+1));
//     // top
//     neighbors.push(course.getCell(posX, posY+1));  
// }


// class Hazard {
//     constructor(terr, seedX, seedY) {
//         this.terr = terr;
//         this.seedX = seedX;
//         this.seedY = seedY;
//         this.seedCoord = {x: seedX, y: seedY};
//     }

//     propagate(level) {
//         let neighbors = getNeighbors()
//     }


// }

// Utility functions
const degreesToRadians = (angle) => {
    var pi = Math.PI;
    return angle * (pi / 180);
}

const angleBtwnCells = (p1, p2) => {
    return Math.atan2(p2.posY - p1.posY, p2.posX - p1.posX) * 180 / Math.PI;
}

let course = generateCourse(30,2);
generateCourseHTML(course);
let ball = course.ball;