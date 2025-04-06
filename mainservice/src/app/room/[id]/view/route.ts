import roomRootObject from "@/db/objects/roomRoot";
import roomScreenCountObject from "@/db/objects/roomScreenCount";
import { codeValidation } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const room = (await params).id;
  const roomRes = await codeValidation().safeParseAsync(room);
  if (!roomRes.success) {
    throw new Error("Invalid room code");
  }

  if (!(await roomRootObject.exists(roomRes.data))) {
    throw new Error("Room does not exist");
  }
  const screen = await roomScreenCountObject.incr(room);
  redirect(`view/${screen}`);
}
