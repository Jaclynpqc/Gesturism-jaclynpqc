import cv2
import mediapipe as mp
import time

cap = cv2.VideoCapture(1) #webcam number

mpHands = mp.solutions.hands
hands = mpHands.Hands() #default max detection 2 hands
mpDraw = mp.solutions.drawing_utils

pTime = 0
cTime = 0

while True:
    success, img = cap.read() #give frame
    imgRGB = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    results = hands.process(imgRGB)
    #detect hand coordinations
    #print(results.multi_hand_landmarks)

    #Checking how many hand is in the frame
    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            for id,lm in enumerate(handLms.landmark):
                h,w,c = img.shape #check out the height, weight and channel
                cx,cy = int(lm.x*w),int(lm.y*h) # find the position of the center
                if id == 0: #Finding the specifc area of the hand
                    cv2.circle(img,(cx,cy),15,(255,0,255),cv2.FILLED) #detecting the 0 poimt landmark
            mpDraw.draw_landmarks(img, handLms, mpHands.HAND_CONNECTIONS) #Draw on the hand landmarks dots and connections
    
    #calculate frame per second
    cTime = time.time()
    fps = 1/(cTime-pTime)
    pTime = cTime

    cv2.putText(img, str(int(fps)),(10,70),cv2.FONT_HERSHEY_PLAIN,3,
                (255,0,255),3)

    cv2.imshow("Image", img)
    cv2.waitKey(1)