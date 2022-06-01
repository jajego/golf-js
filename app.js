class Course {
    constructor(size, difficulty) {
        this.size = size;
        this.difficulty = difficulty;
        this.map = [];
        this.coords = [];
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
        if(chance <= 0) {
            return;
        } else {
            this.changeTerrain('sand');
            let neighbors = this.getCellNeighbors();
            for(let neighbor of neighbors) {
                let rand = Math.random();
                if(rand < chance) {
                    neighbor.changeTerrain('sand');
                    neighbor.propagate(chance-0.3);
                    // console.log(neighbor);
                }

            }
        }

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
    return course;
}

const generateCell = (terr, posX, posY) => {}

const propagate = (cell) => {
}

for(let i = 0; i < 10; i++) {
    let course = generateCourse(10,1);
    let cell = course.getCell(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10));
    cell.propagate(0.70);

    let output = [];
    let counter = 0;
    for(let i = 0; i < 10; i++) {
        let line = '';
        for(let j = 0; j < 10; j++) {
            course.map[counter].terr == 'grass' ? line += '🟩' : line += '🟨';
            counter += 1;
        }
        output.unshift(line)
        line = '';
    }
        console.log('Course #' + (Number(i) + 1) + ':')
        for(let i of output){
            console.log(i)
            
        }
        console.log('--------------------')

}


// setInterval();

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

// class Ball {

// }