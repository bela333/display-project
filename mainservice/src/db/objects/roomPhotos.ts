import { ROOM_LIFETIME } from "@/lib/consts";
import redis from "../redis";
import { roomPhotoName, roomPhotoPath, roomPhotosSet } from "../redis-keys";

const roomPhotosObject = {
  photosSet: {
    async get(room: string) {
      return redis.sMembers(roomPhotosSet(room));
    },
    async member(room: string, photo: string) {
      return redis.sIsMember(roomPhotosSet(room), photo);
    },
    async add(room: string, photo: string) {
      await redis.sAdd(roomPhotosSet(room), photo);
      await redis.expire(roomPhotosSet(room), ROOM_LIFETIME);
    },
    async remove(room: string, photo: string) {
      await redis.sRem(roomPhotosSet(room), photo);
    },
  },
  photoName: {
    async get(room: string, photo: string) {
      return redis.get(roomPhotoName(room, photo));
    },
    async set(room: string, photo: string, photoName: string) {
      await redis.set(roomPhotoName(room, photo), photoName);
    },
  },
  photoPath: {
    async get(room: string, photo: string) {
      return redis.get(roomPhotoPath(room, photo));
    },
    async set(room: string, photo: string, photoPath: string) {
      await redis.set(roomPhotoPath(room, photo), photoPath);
    },
  },
};

export default roomPhotosObject;
