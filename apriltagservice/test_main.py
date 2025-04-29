from .main import app, ProcessRequest, Screen, ProcessResponse
from fastapi.testclient import TestClient
import os
from requests_mock import Mocker
import pytest

client = TestClient(app)


def pytest_generate_tests(metafunc):
    os.environ["S3_ENDPOINT_INTERNAL"] = "http://minio.getcrossview.com"
    os.environ["S3_CALIBRATION_BUCKET"] = "calibrations"


def mock_single_file(requests_mock: Mocker, filename: str):
    with open(f"test/{filename}", "rb") as f:
        requests_mock.get(
            f"http://minio.getcrossview.com/calibrations/{filename}", content=f.read()
        )


@pytest.fixture
def mock_minio(requests_mock: Mocker):
    mock_single_file(requests_mock, "image_no_tag.png")
    mock_single_file(requests_mock, "image_one_tag.png")
    mock_single_file(requests_mock, "image_one_perspective.png")
    mock_single_file(requests_mock, "image_two_tag.png")
    mock_single_file(requests_mock, "image_two_perspective.png")


def test_no_tag_no_screen(mock_minio):
    req: ProcessRequest = ProcessRequest(
        filename="image_no_tag.png", screens=[], upload_url=None
    )
    resp = client.post("/", json=req.model_dump())
    res = resp.json()
    assert res["detail"] == "No tags have been found"


def test_no_tag(mock_minio):
    req = ProcessRequest(
        filename="image_no_tag.png",
        screens=[Screen(id=1, screenSize=[512, 512], codeSize=512, codeOffset=[0, 0])],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = resp.json()
    assert resp.status_code == 422
    assert res["detail"] == "No tags have been found"


def test_one_tag_no_screen(mock_minio):
    req = ProcessRequest(
        filename="image_one_tag.png",
        screens=[],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = resp.json()
    assert res["detail"] == "No tags have been found"


def test_one_tag(mock_minio):
    req = ProcessRequest(
        filename="image_one_tag.png",
        screens=[
            Screen(id=1, screenSize=[1920, 1080], codeSize=768, codeOffset=[1056, 156])
        ],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = ProcessResponse(resp.json())
    assert resp.status_code == 200
    assert res["width"] == 1920
    assert res["height"] == 1080
    assert len(res["screens"]) == 1
    screen = res["screens"][0]
    assert screen["id"] == 1
    assert screen["homography"] == [
        pytest.approx([1, 0, 0]),
        pytest.approx([0, 1, 0]),
        pytest.approx([0, 0, 1]),
    ]


def test_one_tag_perspective(mock_minio):
    req = ProcessRequest(
        filename="image_one_perspective.png",
        screens=[
            Screen(id=1, screenSize=[1920, 1080], codeSize=768, codeOffset=[1056, 156])
        ],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = ProcessResponse(resp.json())
    assert resp.status_code == 200
    assert res["width"] == 1920
    assert res["height"] == 1080
    assert len(res["screens"]) == 1
    screen = res["screens"][0]
    assert screen["id"] == 1
    assert screen["homography"] == [
        pytest.approx([1, 0, 0]),
        pytest.approx([0, 1, 0]),
        pytest.approx([0, 0, 1]),
    ]


def test_one_tag_result(mock_minio, requests_mock: Mocker):
    matcher = requests_mock.put(
        "http://minio.getcrossview.com/calibrations/uploaded.png"
    )
    req = ProcessRequest(
        filename="image_one_perspective.png",
        screens=[
            Screen(id=1, screenSize=[1920, 1080], codeSize=768, codeOffset=[1056, 156])
        ],
        upload_url="http://minio.getcrossview.com/calibrations/uploaded.png",
    )
    resp = client.post("/", json=req.model_dump())
    assert resp.status_code == 200
    assert matcher.called_once
    last_request = matcher.last_request
    assert (
        str(last_request)
        == "PUT http://minio.getcrossview.com/calibrations/uploaded.png"
    )
    body: bytes = last_request.body
    with open("test/image_one_perspective_warped.png", "rb") as ref:
        assert ref.read() == body


def test_two_tag(mock_minio):
    req = ProcessRequest(
        filename="image_two_tag.png",
        screens=[
            Screen(id=1, screenSize=[958, 1048], codeSize=383, codeOffset=[526, 332]),
            Screen(id=2, screenSize=[958, 1048], codeSize=383, codeOffset=[526, 332]),
        ],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = ProcessResponse(resp.json())
    assert resp.status_code == 200
    assert res["width"] == 1923
    assert res["height"] == 1050
    assert len(res["screens"]) == 2
    screen1 = next(screen for screen in res["screens"] if screen["id"] == 1)
    screen2 = next(screen for screen in res["screens"] if screen["id"] == 2)
    # 0.003 is an error of ~3 pixels
    assert screen1["homography"] == [
        pytest.approx([0.5, 0, 0], abs=0.003),
        pytest.approx([0, 1, 0], abs=0.003),
        pytest.approx([0, 0, 1], abs=0.003),
    ]
    assert screen2["homography"] == [
        pytest.approx([0.5, 0, 0.5], abs=0.003),
        pytest.approx([0, 1, 0], abs=0.003),
        pytest.approx([0, 0, 1], abs=0.003),
    ]


def test_two_tag_perspective(mock_minio):
    req = ProcessRequest(
        filename="image_two_perspective.png",
        screens=[
            Screen(id=1, screenSize=[958, 1048], codeSize=383, codeOffset=[526, 332]),
            Screen(id=2, screenSize=[958, 1048], codeSize=383, codeOffset=[526, 332]),
        ],
        upload_url=None,
    )
    resp = client.post("/", json=req.model_dump())
    res = ProcessResponse(resp.json())
    assert resp.status_code == 200
    assert res["width"] == pytest.approx(1923, abs=2)
    assert res["height"] == pytest.approx(1050, abs=2)
    assert len(res["screens"]) == 2
    screen1 = next(screen for screen in res["screens"] if screen["id"] == 1)
    screen2 = next(screen for screen in res["screens"] if screen["id"] == 2)
    # 0.003 is an error of ~3 pixels
    assert screen1["homography"] == [
        pytest.approx([0.5, 0, 0], abs=0.003),
        pytest.approx([0, 1, 0], abs=0.003),
        pytest.approx([0, 0, 1], abs=0.003),
    ]
    assert screen2["homography"] == [
        pytest.approx([0.5, 0, 0.5], abs=0.003),
        pytest.approx([0, 1, 0], abs=0.003),
        pytest.approx([0, 0, 1], abs=0.003),
    ]
