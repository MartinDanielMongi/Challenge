import cv2
import base64
import numpy as np
import sys
def crop_image(image_path,posX, posY, sizeWidth, sizeHeight,greyScale):  
    if sys.argv[6].lower()== "false":
        greyScale=False
    else:
        greyScale=True
    image=cv2.imread(image_path)
    image_cropped=image[posY:posY+sizeHeight, posX:posX+sizeWidth]
    if greyScale==True:
        image_cropped= cv2.cvtColor(image_cropped, cv2.COLOR_BGR2GRAY)
    _, img_encoded = cv2.imencode('.jpeg', image_cropped)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')
    print(img_base64)
    return 0

crop_image(str(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]), sys.argv[6])



