export function roomCount() {
  return "roomCount";
}

export function roomRoot(room: string) {
  return `room:${room}`;
}

export function roomPubSub(room: string) {
  return roomRoot(room);
}

export function roomScreenCount(room: string) {
  return `${roomRoot(room)}:screenCount`;
}

export function roomMode(room: string) {
  return `${roomRoot(room)}:mode`;
}

export function roomScreenAvailable(room: string) {
  return `${roomRoot(room)}:available`;
}

export function roomImageRoot(room: string) {
  return `${roomRoot(room)}:image`;
}

export function roomImageName(room: string) {
  return roomImageRoot(room);
}
export function roomImageWidth(room: string) {
  return `${roomImageRoot(room)}:width`;
}
export function roomImageHeight(room: string) {
  return `${roomImageRoot(room)}:height`;
}

export function roomContentRoot(room: string) {
  return `${roomRoot(room)}:content`;
}

export function roomContentType(room: string) {
  return `${roomContentRoot(room)}:type`;
}

export function roomContentFilename(room: string) {
  return `${roomContentRoot(room)}:url`;
}

export function screenRoot(room: string, screen: number) {
  return `${roomRoot(room)}:screen:${screen}`;
}

export function screenConfig(room: string, screen: number) {
  return `${screenRoot(room, screen)}:config`;
}

export function screenPing(room: string, screen: number) {
  return `${screenRoot(room, screen)}:ping`;
}

export function screenHomography(room: string, screen: number) {
  return `${screenRoot(room, screen)}:homography`;
}
