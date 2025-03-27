import { type ReactNode } from "react";
import RoomContextProvider from "../../RoomContextProvider";

export default async function RoomLayout({
  children,
  params,
}: Readonly<{ children?: ReactNode; params: Promise<{ id: string }> }>) {
  const room = (await params).id;
  return <RoomContextProvider room={room}>{children}</RoomContextProvider>;
}
