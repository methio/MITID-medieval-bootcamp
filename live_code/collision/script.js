/*
    In this sketch: 
    - we detect a collision between right_wrist and a target
    - on collision, we switch on a led
*/

let board;
let led;            // digital led

let bodyPose;       // bodyPose model
let video;          // webcam data
let poses = [];     // detected poses

// our target 
let target = {
    x: 300,
    y: 200,
    d: 50
}

async function setup() {
    createCanvas(700, 500);
    board = createBoard();
    createConnectButton(board);

    led = new five.Led(3);              // create a led

    video = createCapture(VIDEO);       // we open the webcam
    video.size(700, 500);
    video.hide();

    bodyPose = await ml5.bodyPose();         // load bodypose model
    bodyPose.detectStart(video, r=>poses=r); // start the detection
}

function draw() {
    image(video, 0, 0);

    // make sure at least one person is detected
    if(poses.length > 0){
        // 1️⃣ right wrist coordinates
        let rw = poses[0].right_wrist;  
        
        // 2️⃣ get the distance
        let distance = dist(rw.x, rw.y, target.x, target.y);

        // 3️⃣ we consider collision true if distance is smaller than target size
        let isColliding = distance < target.d;

        // 3️⃣ debug collision
        fill("#000");
        textSize(40);
        text(isColliding, 20, 60);

        // 4️⃣ if collision switch on led (and circle color)
        if(isColliding){
            fill("#FF0000");
            led.on();
        }else{
            fill("#00FF00");
            led.off();
        }

        // 🪄 display elements on the canvas
        circle(target.x, target.y, target.d);   // target
        circle(rw.x, rw.y, 10);                 // right wrist
        line(target.x, target.y, rw.x, rw.y);   // line between them
    }
}