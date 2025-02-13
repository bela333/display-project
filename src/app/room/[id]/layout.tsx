import { type ReactNode } from "react";
import RoomSubscriptionProvider from "./_components/RoomSubscriptionProvider";

export default async function RoomLayout({
  children,
  params,
}: Readonly<{ children?: ReactNode; params: Promise<{ id: string }> }>) {
  const room = (await params).id;
  return (
    <RoomSubscriptionProvider room={room}>{children}</RoomSubscriptionProvider>
  );
}
