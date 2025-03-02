import { type ReactNode } from "react";
import ScreenContextProvider from "./_components/ScreenContextProvider";
import redis from "@/app/db/redis";
import { roomPubSub, roomScreenCount } from "@/app/db/redis-keys";

export default async function ViewLayout({
  children,
  params,
}: Readonly<{
  children?: ReactNode;
  params: Promise<{ id: string; screen: string }>;
}>) {
  const room = (await params).id;
  const screen = Number((await params).screen);
  await redis.publish(roomPubSub(room), "ping");
  return (
    <ScreenContextProvider screenID={screen} roomID={room}>
      {children}
    </ScreenContextProvider>
  );
}
