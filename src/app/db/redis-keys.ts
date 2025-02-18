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

export function screenRoot(room: string, screen: number) {
  return `${roomRoot(room)}:screen:${screen}`;
}

export function screenConfig(room: string, screen: number) {
  return `${screenRoot(room, screen)}:config`;
}

export function screenPing(room: string, screen: number) {
  return `${screenRoot(room, screen)}:ping`;
}
