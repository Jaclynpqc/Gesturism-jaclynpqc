// A Proof of Concept of Movement-based Drawing Canvas

color trackColor;

void setup(){
    size(640, 360);
    String[] cameras = Capture.list();
    printArray(camera);
    video = new Capture(this, cameras[3]);
    video.start();
    // Start off tracking for red
    trackColor = color(255,0,0);
}

void captureEvent(Capture video){
    // Read image from the camera
    video.read();
}

void draw(){
    video.loadPixels();
    image(video,0,0);

    // Searching the closet color to red
    float worldRecord = 500

    //XY coordinate of closet color
    int closestX = 0;
    int closestY = 0;

    //Begin loop to walk through every pixel
    for (int x = 0; x<video.width; x++){
        for (int y = 0; y<video.height; y++){
            int loc = x + y * video.width;
            //What is the current color
            color currentColor = video.pixels[loc];

            float r1 = red(currentColor);
            float g1 = green(currentColor);
            float b1 = blue(currentColor);
            float r2 = red(trackColor);
            float g2 = green(trackColor);
            float b2 = blue(trackColor);

            //Using euclidean distance to compare colors
            float d = dist(r1,g1,b1,r2,g2,b2);

            //If current color is more similar to tracked color, save current location
            if (d < worldRecord){
                worldRecord = d;
                closestX = x;
                closestY = y;
            }
        }
    }
}