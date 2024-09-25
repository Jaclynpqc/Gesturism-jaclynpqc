import cv2
import numpy as np
import time
import os
import HandTrackingModule as html

#path to header folder
folderPath = "Header"
myList = os.listdir(folderPath)
overLayList = []
for imPath in myList:
    image = cv2.imread(f'{folderPath}/{imPath}') #read headers
    print(imPath)
    overLayList.append(image)
print(len(overLayList))


header = overLayList[1]
#Create loop to run webcam

cap = cv2.VideoCapture(1)
cap.set(3, 1280)
cap.set(4, 720)

while True:
    success, img = cap.read()

    img[0:125, 0:1280] = header #carve space for header
    cv2.imshow("Image", img)
    cv2.waitKey(1)