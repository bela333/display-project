import roomScreenCountObject from "@/db/objects/roomScreenCount";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const room = (await params).id;
  const screen = await roomScreenCountObject.incr(room);
  redirect(`view/${screen}`);
}
