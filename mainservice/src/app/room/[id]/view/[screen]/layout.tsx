import { type ReactNode } from "react";
import ScreenContextProvider from "./ScreenContextProvider";

import { Switcher } from "./Switcher";
import roomPubSubObject from "@/db/objects/roomPubSub";

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
  await roomPubSubObject.ping(room);
  return (
    <ScreenContextProvider screenID={screen} roomID={room}>
      <Switcher calibration={calibration} viewing={viewing} />
    </ScreenContextProvider>
  );
}
