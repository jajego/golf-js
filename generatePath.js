// could be implemented as a class
class Path {
    // better to input as cell or coordpt?
    constructor(course, startCell, endCell) {
        this.course     = course;
        this.startCell  = startCell;
        this.endCell    = endCell;
        this.path       = [];
        this.slope      = (endCell.posY - startCell.posY) / (endCell.posX - startCell);
        this.y          = this.slope*this.startCell.posX;
        this.b          = startCell.posY - slope * startCell.posX;
        this.equation   = `${this.slope}x + ${this.b}`
    }
}



const generatePath = (p1, p2) => {
    let path = [];
    let slope = (p2.posY - p1.posY) / (p2.posX - p1.posX);
    console.log(`Slope is ${slope}`)
    let y = slope*p1.posX;
    let b = p1.posY - slope * p1.posX;
    console.log(`The equation of the line is y = ${slope}x + ${b}`)
    let dx = p2.posX - p1.posX;
    let dy = p2.posY - p1.posY;

    if(slope == Infinity){
        for(let i = 1; i < dy; i++) {
            path.push([p1.posX, p1.posY + i ])
        }
    } else {
        if(dx > 0 && dy > 0) {
            for(let i = 0; i < dx; i++) {
                let stepX = i + p1.posX;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push([stepX, stepY]);
                } else {
                    let stepY = Math.floor(slope*stepX + b);
                    path.push([stepX, stepY]);
                }
            }
        }

        if(dx < 0 && dy > 0) {
            console.log('dx < 0, dy > 0')
            for(let i = p1.posX; i > p2.posX; i--) {
                let stepX = i;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push([stepX, stepY]);
                } else {
                    let stepY = Math.ceil(slope*stepX + b);
                    path.push([stepX, stepY]);
                }
            }
        }

        if(dx > 0 && dy < 0){
            for(let i = 0; i < dx; i++) {
                let stepX = i + p1.posX;
                if(slope % 1 ==0){
                    let stepY = slope*stepX + b;
                    path.push([stepX, stepY]);
                } else {
                    let stepY = Math.floor(slope*stepX + b);
                    path.push([stepX, stepY]);
                }

            }
        }
         if(dx < 0 && dy < 0) {
            for(let i = p1.posX; i > p2.posX; i--) {
                let stepX = i;
                if(slope % 1 == 0) {
                    let stepY = slope*stepX + b;
                    path.push([stepX, stepY]);
                } else {
                    let stepY = Math.ceil(slope*stepX + b);
                    path.push([stepX, stepY]);
                }
            }
        }
    }
    console.log(path);
    return path;
}

const interpolatePath = (path) => {
    let newPath = [];
    // for dx > 0 and dy > 0
    let startX = path[0][0];
    let startY = path[0][1];
    let endX = path[path.length-1][0]
    let endY = path[path.length-1][1]

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
            let startX = path[i-1][0];
            let startY = path[i-1][1];
            let endX = path[i][0];
            let endY = path[i][1];
            let dy = endY - startY;

            for(let j=1; j < dy+1; j++) {
                newPath.push([startX+1, startY+j])
            }
        }
    }
    // tested: works
    if(dx < 0 && dy > 0) {
        for(let i = 1; i < path.length; i++) {
            newPath.push(path[i-1]);
            
            let startX = path[i-1][0];
            let startY = path[i-1][1];
            let endX = path[i][0];
            let endY = path[i][1];
            let dy = endY - startY;

            for(let j=1; j < dy+1; j++) {
                newPath.push([startX-1, startY+j])
            }
        }
    }
    // tested: works
    if(dx > 0 && dy < 0) {
            console.log('dx > 0 and dy < 0 running')
            for(let i = 1; i < path.length; i++) {
                newPath.push(path[i-1]);
                let startX = path[i-1][0];
                let startY = path[i-1][1];
                let endX = path[i][0];
                let endY = path[i][1];
                let dy = endY - startY;

                for(let j=1; j > dy+1; j--) {
                    newPath.push([startX+1, startY-j])
                }
            }
        }
     if(dx < 0 && dy < 0) {
            for(let i = 1; i < path.length; i++) {
                newPath.push(path[i-1]);
                let startX = path[i-1][0];
                let startY = path[i-1][1];
                let endX = path[i][0];
                let endY = path[i][1];
                let dy = endY - startY;

                for(let j=1; j > dy+1; j--) {
                    console.log('j running')
                    newPath.push([startX-1, startY-j])
                }
            }
        }
    // currently returns with repeats
    return newPath;
}

let p1 = {posX: 20, posY: 20};
let p2 = {posX: 5, posY: 5};
console.log('Path:')
console.log('-----------------------------\n')
let path = generatePath(p1, p2)
// console.log('Interpolated path:');
// console.log('-----------------------------\n')
console.log(interpolatePath(path));


