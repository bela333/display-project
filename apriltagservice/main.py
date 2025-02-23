from fastapi import FastAPI, File, Form
import typing as t
from pydantic import BaseModel, Json
import cv2
import numpy as np
from pupil_apriltags import Detector

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
    screenSize: t.Tuple[int, int]
    codeSize: int
    codeOffset: t.Tuple[int, int]


class ProcessRequest(BaseModel):
    """
    ProcessRequest is a model that represents a request to process screens.

    Attributes:
        screens (List[Screen]): A list of Screen objects to be processed.
    """

    screens: t.List[Screen]


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


@app.post("/")
def process_image(
    file: t.Annotated[bytes, File()], params: t.Annotated[Json[ProcessRequest], Form()]
):
    image = cv2.imdecode(
        np.asarray(bytearray(file), dtype="uint8"), cv2.IMREAD_COLOR_BGR
    )
    grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Find tags
    tags = detector.detect(grayscale)

    response_screens = []

    # TODO: Try to fit all tags on a single surface

    for tag in tags:
        # Find screen corresponding to tag
        screen = next(
            (screen for screen in params.screens if screen.id == tag.tag_id), None
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
        # and bottom right corner is (screen.screenSize[0], screen.screenSize[1])
        # currently they are (0, 0) and (1, 1)
        homography = homography.dot(np.array(([1/screen.screenSize[0], 0, 0], [0, 1/screen.screenSize[1], 0], [0, 0, 1])))
        homography = np.array(([screen.screenSize[0]/grayscale.shape[1], 0, 0], [0, screen.screenSize[1]/grayscale.shape[0], 0], [0, 0, 1])).dot(homography)
        response_screens.append({"id": screen.id, "homography": homography.tolist()})
    print(response_screens)
    return response_screens
