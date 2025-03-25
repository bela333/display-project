import { type ReactNode } from "react";
import ScreenContextProvider from "./_components/ScreenContextProvider";

import { Switcher } from "./Switcher";
import redis from "@/db/redis";
import { roomPubSub } from "@/db/redis-keys";

export default async function ViewLayout({
  params,
  calibration,
  viewing,
}: Readonly<{
  params: Promise<{ id: string; screen: string }>;
  calibration: ReactNode;
  viewing: ReactNode;
}>) {
  const room = (await params).id;
  const screen = Number((await params).screen);
  await redis.publish(roomPubSub(room), "ping");
  return (
    <ScreenContextProvider screenID={screen} roomID={room}>
      <Switcher calibration={calibration} viewing={viewing} />
    </ScreenContextProvider>
  );
}
