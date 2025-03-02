import redis from "@/app/db/redis";
import { roomScreenCount } from "@/app/db/redis-keys";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const room = (await params).id;
  const screen = await redis.incr(roomScreenCount(room));
  redirect(`view/${screen}`);
}
