import cv2
import mediapipe as mp
import time

class handDetector():
    def __init__(self, mode = False, maxHands = 2, detectionCon = 1, trackCon = 0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands,
                                        self.detectionCon, self.trackCon) #default max detection 2 hands
        self.mpDraw = mp.solutions.drawing_utils
        self.tipIds = [4,8,12,16,20]
    def findHands(self, img, draw = True):
        imgRGB = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)
        #detect hand coordinations
        #print(results.multi_hand_landmarks)

        #Checking how many hand is in the frame
        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    self.mpDraw.draw_landmarks(img, handLms,
                                                self.mpHands.HAND_CONNECTIONS) #Draw on the hand landmarks dots and connections
        return img
    
    def findPosition(self, img, handNo = 0, draw = True):
        self.lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
            for id,lm in enumerate(myHand.landmark):
                                h,w,c = img.shape #check out the height, weight and channel
                                cx,cy = int(lm.x*w),int(lm.y*h) # find the position of the center
                                self.lmList.append([id,cx,cy])
                                if draw:
                                    cv2.circle(img,(cx,cy),15,(255,0,255),cv2.FILLED) #detecting the 0 poimt landmark
        
        return self.lmList
    
    def fingersUp(self):
        fingers = []
        #Thumb
        if self.lmList[self.tipIds[0]][1] < self.lmList[self.tipIds[0]-1][1]:
            fingers.append(1)
        else:
            fingers.append(0)

        # 4 Fingers
        for id in range (1,5):
            if self.lmList[self.tipIds[id]][2] < self.lmList[self.tipIds[id]-2][2]:
                fingers.append(1)
            else:
                fingers.append(0)
        return fingers
        
                        
def main():
    pTime = 0
    cTime = 0
    cap = cv2.VideoCapture(1) #webcam number
    detector = handDetector()
    while True:
        success, img = cap.read() #give frame
        img = detector.findHands(img) #draw=False
        lmlist = detector.findPosition(img) #draw=False
        if len(lmlist) != 0:
             print(lmlist[0])
        #calculate frame per second
        cTime = time.time()
        fps = 1/(cTime-pTime)
        pTime = cTime

        cv2.putText(img, str(int(fps)),(10,70),cv2.FONT_HERSHEY_PLAIN,3,
                (255,0,255),3)

        cv2.imshow("Image", img)
        cv2.waitKey(1)



if __name__ == "__main__":
    main()