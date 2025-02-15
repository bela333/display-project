import { type ReactNode } from "react";
import ScreenContextProvider from "./_components/ScreenContextProvider";
import redis from "@/lib/redis";
import { roomPubSub, roomScreenCount } from "@/lib/redis-keys";

export default async function ViewLayout({
  children,
  params,
}: Readonly<{ children?: ReactNode; params: Promise<{ id: string }> }>) {
  const room = (await params).id;
  const screen = await redis.incr(roomScreenCount(room));
  await redis.publish(roomPubSub(room), "ping");
  return (
    <ScreenContextProvider screenID={screen} roomID={room}>
      {children}
    </ScreenContextProvider>
  );
}
