from fastapi import FastAPI, File, Form
import typing as t
from pydantic import BaseModel, Json
import cv2
import numpy as np
from pupil_apriltags import Detector
import requests
from os import environ

assert environ.get("S3_ENDPOINT_INTERNAL")
assert environ.get("S3_BUCKET")
S3_ENDPOINT_INTERNAL = environ.get("S3_ENDPOINT_INTERNAL")
S3_BUCKET = environ.get("S3_BUCKET")

app = FastAPI()


class Screen(BaseModel):
    """
    Screen model representing the display configuration.

    Attributes:
        id (int): The unique identifier for the screen.
        screenSize (Tuple[int, int]): The size of the screen as a tuple (width, height).
        codeSize (int): The size of the code to be displayed on the screen.
        codeOffset (Tuple[int, int]): The offset of the code from the top-left corner of the screen as a tuple (x, y).
    """

    id: int
    screenSize: tuple[int, int]
    codeSize: int
    codeOffset: tuple[int, int]


class ProcessRequest(BaseModel):
    """
    ProcessRequest is a model that represents a request to process screens.

    Attributes:
        screens (List[Screen]): A list of Screen objects to be processed.
    """
    filename: str
    screens: list[Screen]
    upload_url: str | None


detector = Detector()

# screen <- code homography
def construct_code_homography(screen: Screen):
    return np.array(
        (
            [
                screen.codeSize / screen.screenSize[0],
                0,
                screen.codeOffset[0] / screen.screenSize[0],
            ],
            [
                0,
                screen.codeSize / screen.screenSize[1],
                screen.codeOffset[1] / screen.screenSize[1],
            ],
            [0, 0, 1],
        )
    )

ResponseScreen = t.TypedDict('Response', {'id': int, 'homography': list})

@app.post("/")
def process_image(
    req: ProcessRequest
):
    file = requests.get(f"{S3_ENDPOINT_INTERNAL}/{S3_BUCKET}/{req.filename}")

    image = cv2.imdecode(
        np.asarray(bytearray(file.content), dtype="uint8"), cv2.IMREAD_COLOR_BGR
    )
    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Find tags
    tags = detector.detect(grayscale)

    homographies: dict[int, np.ndarray] = {}

    for tag in tags:
        # Find screen corresponding to tag
        screen = next(
            (screen for screen in req.screens if screen.id == tag.tag_id), None
        )
        if screen is None:
            continue
        # Calculate screen homography from
        # screen <- code homography
        # and picture <- code homography
        code_homography = construct_code_homography(screen)
        homography: np.array = tag.homography.dot(
            np.array(([2, 0, -1], [0, 2, -1], [0, 0, 1]))
        ).dot(np.linalg.inv(code_homography))
        # transform homography, such inputs are in pixel space
        # so top left corner is (0, 0)
        # and bottom right corner is (1, 1)
        homography = np.array(([1/grayscale.shape[1], 0, 0], [0, 1/grayscale.shape[0], 0], [0, 0, 1])).dot(homography)
        homographies[screen.id] = homography

    # We want to have a common coordinate system for every screen
    # based on the screen with the smallest ID
    template_id = min(homographies.items(), key=lambda a: a[0])[0]
    template = homographies[template_id]
    template_inv = np.linalg.inv(template)

    (left, top, right, bottom) = (0, 0, 1, 1)

    # Find corners of virtual screen in template's coordinate system
    for id, homography in homographies.items():
        h = template_inv.dot(homography)
        for x in range(0, 2):
            for y in range(0, 2):
                p = h.dot((x, y, 1))
                p /= p[2]
                left = min(left, p[0])
                top = min(top, p[1])
                right = max(right, p[0])
                bottom = max(bottom, p[1])
    
    # We can use these corners to calculate the homography for the virtual screen
    virtual = template.dot([[right-left, 0, left], [0, bottom-top, top], [0, 0, 1]])
    virtual_inv = np.linalg.inv(virtual)
    

    # Then we embed every screen homography into the coordinate system of the virtual screen
    for id, homography in homographies.items():
        homography = virtual_inv.dot(homography)
        homography /= homography[2][2]
        homographies[id] = homography

    response_screens: list[ResponseScreen] = [{"id": k, "homography": v.tolist()} for k, v in homographies.items()]

    template_screen = next(a for a in req.screens if a.id == template_id)
    inner_width = abs(right-left)
    inner_height = abs(bottom-top)
    width = int(template_screen.screenSize[0]*inner_width)
    height = int(template_screen.screenSize[1]*inner_height)

    if req.upload_url is not None:
        imagespace_virtual = np.matrix(((image.shape[1], 0, 0), (0, image.shape[0], 0), (0, 0, 1))) * virtual * np.matrix(((1/width, 0, 0), (0, 1/height, 0), (0, 0, 1)))
        imagespace_virtual = np.linalg.inv(imagespace_virtual)
        generated = cv2.warpPerspective(grayscale,imagespace_virtual, (width, height))
        res, generated_image = cv2.imencode(".jpg", generated)
        if not res:
            # TODO: Handle error
            pass
        generated_image = bytes(generated_image)
        requests.put(req.upload_url, generated_image) # TODO: Handle error

    resp = {
        "screens": response_screens,
        "width": width,
        "height": height,
    }
    return resp
