import { ROOM_LIFETIME } from "@/lib/consts";
import { roomPhotoName, roomPhotoPath, roomPhotosSet } from "../redis-keys";
import getRedis from "../redis";

const roomPhotosObject = {
  photosSet: {
    async get(room: string) {
      return (await getRedis()).sMembers(roomPhotosSet(room));
    },
    async member(room: string, photo: string) {
      return (await getRedis()).sIsMember(roomPhotosSet(room), photo);
    },
    async add(room: string, photo: string) {
      await (await getRedis()).sAdd(roomPhotosSet(room), photo);
      await (await getRedis()).expire(roomPhotosSet(room), ROOM_LIFETIME);
    },
    async remove(room: string, photo: string) {
      await (await getRedis()).sRem(roomPhotosSet(room), photo);
    },
  },
  photoName: {
    async get(room: string, photo: string) {
      return (await getRedis()).get(roomPhotoName(room, photo));
    },
    async set(room: string, photo: string, photoName: string) {
      await (await getRedis()).set(roomPhotoName(room, photo), photoName);
    },
  },
  photoPath: {
    async get(room: string, photo: string) {
      return (await getRedis()).get(roomPhotoPath(room, photo));
    },
    async set(room: string, photo: string, photoPath: string) {
      await (await getRedis()).set(roomPhotoPath(room, photo), photoPath);
    },
  },
};

export default roomPhotosObject;
