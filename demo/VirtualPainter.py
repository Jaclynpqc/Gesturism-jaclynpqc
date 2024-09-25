import cv2
import numpy as np
import time
import os
import HandTrackingModule as html


#################
brushThickness = 15
eraserThickness = 50
#################
#path to header folder
folderPath = "Header"
myList = os.listdir(folderPath)
overLayList = []
for imPath in myList:
    image = cv2.imread(f'{folderPath}/{imPath}') #read headers
    print(imPath)
    overLayList.append(image)
print(len(overLayList))


header = overLayList[5]
drawColor = (245,245,245)
# FIX: No idea why the loop does this, but the order is 456231
#Create loop to run webcam

cap = cv2.VideoCapture(1)
cap.set(3, 1280)
cap.set(4, 720)

detector = html.handDetector(detectionCon=1)
xp, yp =0,0
imgCanvas = np.zeros((720,1280,3), np.uint8)

while True:
    # 1. Import image
    success, img = cap.read()
    img = cv2.flip(img,1) #flip image horizontally

    # 2. Find Hand Landmarks
    img = detector.findHands(img)
    lmList = detector.findPosition(img, draw=False)

    if len(lmList) != 0:
        #print(lmList)
        # Get the tip of the index and middle fingers
        x1,y1 = lmList[8][1:] #except id number
        x2,y2 = lmList[12][1:]

        #3. Check which fingers are up
        fingers = detector.fingersUp()
        #print(fingers)
    
        # 4. If Selection mode- TWO fingers are up
        if fingers[1] and fingers[2]:
            cv2.rectangle(img, (x1,y1-25), (x2,y2+25), drawColor, cv2.FILLED)
            print("Selection Mode")
            #Checking for the click
            if y1< 125:
                if 200<x1<350:
                    header = overLayList[3]
                    drawColor = (255,182,193) #pink
                elif 400<x1<550:
                    header = overLayList[4]
                    drawColor = (255,165,0) #orange
                elif 600<x1<750:
                    header = overLayList[0]
                    drawColor = (255,255,0) #yellow
                elif 800<x1<950:
                    header = overLayList[1]
                    drawColor = (50,205,50) #green
                elif 1000<x1<1150:
                    header = overLayList[2]
                    drawColor = (0,0,0) #erase = black
        # 5. If Drawing mode- Index finger is up
        if fingers[1] and fingers[2]==False:
            cv2.circle(img, (x1,y1),15,drawColor, cv2.FILLED)
            print("Drawing Mode")
            if xp == 0 and yp == 0:
                xp, yp = x1, y1

            if drawColor == (0,0,0):
                cv2.line(img, (xp,yp), (x1,y1),drawColor, eraserThickness)
                cv2.line(imgCanvas, (xp,yp), (x1,y1),drawColor, eraserThickness)

            else:
                cv2.line(img, (xp,yp), (x1,y1),drawColor, brushThickness)
                cv2.line(imgCanvas, (xp,yp), (x1,y1),drawColor, brushThickness)
            xp,yp = x1, y1

    # Setting the header image
    img[0:125, 0:1280] = header #carve space for header
    img = cv2.addWeighted(img,0.5,imgCanvas,0.5,0)
    cv2.imshow("Image", img)
    #cv2.imshow("Canvas", imgCanvas)
    cv2.waitKey(1)