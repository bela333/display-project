export function roomCount() {
  return "roomCount";
}

export function roomRoot(room: string) {
  return `room:${room}`;
}

export function roomPubSub(room: string) {
  return roomRoot(room);
}
