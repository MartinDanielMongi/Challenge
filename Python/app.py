import config
import socketio
import cv2
import base64

## In memory images
images = {}

def resize_image(imageId, imagePath, sizeWidth, sizeHeight):
  ## Check in memory images
  if imageId in images:
    imageOriginal = images[imageId]
  else:
    imageOriginal = cv2.imread(imagePath)

    images[imageId] = imageOriginal
    
  ## Keep track of original dimensions
  imageOriginalHeight, imageOriginalWidth = imageOriginal.shape[:2]

  ## Calculate new dimension
  if imageOriginalWidth / sizeWidth < imageOriginalHeight / sizeHeight:
    aspectRatio = imageOriginalWidth / sizeWidth

    imageNewWidth = sizeWidth
    imageNewHeight = int(imageOriginalHeight / aspectRatio)
  else:
    aspectRatio = imageOriginalHeight / sizeHeight

    imageNewWidth = int(imageOriginalWidth / aspectRatio)
    imageNewHeight = sizeHeight

  ## Resize image
  imageResized = cv2.resize(imageOriginal, (imageNewWidth, imageNewHeight))

  ## Encode into a memory buffer
  _, imageEncoded = cv2.imencode('.jpeg', imageResized, [int(cv2.IMWRITE_JPEG_QUALITY), 50])

  ## Convert to Base64
  imageBase64 = base64.b64encode(imageEncoded).decode('UTF-8')
  print(imageBase64)
  return imageBase64

def crop_image(imageId, imagePath, positionX, positionY, sizeWidth, sizeHeight, grayScale):
  ## Check in memory images
  if imageId in images:
    imageOriginal = images[imageId]
  else:
    imageOriginal = cv2.imread(imagePath)

    images[imageId] = imageOriginal

  ## Crop image
  imageCropped = imageOriginal[positionY:positionY + sizeHeight, positionX:positionX + sizeWidth]

  ## Convert to grayscale (If needed)
  if grayScale:
    imageCropped = cv2.cvtColor(imageCropped, cv2.COLOR_BGR2GRAY)

  _, imageEncoded = cv2.imencode('.jpeg', imageCropped)

  ## Convert to Base64
  imageBase64 = base64.b64encode(imageEncoded).decode('UTF-8')
  
  return imageBase64

## Socket
sio = socketio.Client()

@sio.event
def connect():
  print('[Socket] Connected to ' + config.socket['protocol'] + '://' + config.socket['ip'] + ':' + config.socket['port'])
  print('[Socket] Emit event \'handshake\'')
  sio.emit('handshake', config.secret)

@sio.event
def handshake_success():
  print('[Socket] Received event \'handshake_success\'')

@sio.event
def image_placeholder_start(data):
  print('[Socket] Received event \'image_placeholder_start\' with', data)
  sio.emit('image_placeholder_end', {'jobId': data['jobId'], 'image': resize_image(data['imageId'], data['imagePath'], config.viewer['width'], config.viewer['height'])})

@sio.event
def image_processing_start(data):
  print('[Socket] Received event \'image_processing_start\' with', data)
  sio.emit('image_processing_end', {'jobId': data['jobId'], 'image': crop_image(data['imageId'], data['imagePath'], data['position']['x'], data['position']['y'], data['size']['width'], data['size']['height'], data['grayScale'])})

@sio.event
def connect_error(data):
  print('[Socket] There was an error connecting to ' + config.socket['protocol'] + '://' + config.socket['ip'] + ':' + config.socket['port'])

@sio.event
def disconnect():
  print('[Socket] Disconnected from ' + config.socket['protocol'] + '://' + config.socket['ip'] + ':' + config.socket['port'])

try:
  sio.connect(config.socket['protocol'] + '://' + config.socket['ip'] + ':' + config.socket['port'])
  sio.wait()
except:
  pass
