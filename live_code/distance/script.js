/*
    In this sketch: 
    - we detect distance between right_wrist and left_wrist
    - we map distance into a brightness value
    - we use brightness for a led
*/

let board;
let led;            // digital led

let bodyPose;       // bodyPose model
let video;          // webcam data
let poses = [];     // detected poses

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
        // 1️⃣ body parts coordinates
        let rw = poses[0].right_wrist;
        let lw = poses[0].left_wrist;  

        
        // 2️⃣ get the distance
        let distance = dist(rw.x, rw.y, lw.x, lw.y);

        // 3️⃣ map distance into brightness
        let brightnessValue = map(distance, 0, 400, 0, 255);

        // 4️⃣ display brightness on the led
            led.brightness(brightnessValue);
    }
}