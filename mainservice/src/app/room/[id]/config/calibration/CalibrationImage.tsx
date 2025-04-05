import { Box, Flex, Skeleton } from "@mantine/core";
import roomContext from "../../_contexts/roomContext";
import { use, useCallback, useState } from "react";
import style from "@/app/page.module.css";
import ScreenVisualization from "./ScreenVisualization";
import { useElementSize } from "@/app/useElementSize";

export default function CalibrationImage() {
  const room = use(roomContext);
  if (room === undefined) {
    throw new Error("Room loading");
  }

  const innerRatio = room.lastEvent.image
    ? room.lastEvent.image.width / room.lastEvent.image.height
    : 16 / 9;

  const [image, setImage] = useState<HTMLDivElement | null>(null);

  const [imageBounds, _setImageBounds] = useState<[number, number]>([1, 1]);
  const setImageBounds = useCallback(
    (bounds: DOMRectReadOnly) => _setImageBounds([bounds.width, bounds.height]),
    []
  );
  useElementSize(image, setImageBounds);

  return (
    <Skeleton
      visible={!room.lastEvent.image}
      animate={!!room.lastEvent.image}
      w="100%"
      style={{ aspectRatio: 16 / 9 }}
      p={8}
      className={style.paper}
    >
      {room.lastEvent.image ? (
        <Flex align="center" justify="center" w="100%" h="100%">
          <Box
            style={{ aspectRatio: innerRatio }}
            w={innerRatio > 16 / 9 ? "100%" : undefined}
            h={innerRatio <= 16 / 9 ? "100%" : undefined}
            maw={innerRatio > 16 / 9 ? "100%" : undefined}
            mah={innerRatio <= 16 / 9 ? "100%" : undefined}
          >
            <Box
              w="100%"
              h="100%"
              style={{
                backgroundImage: `url(${room.lastEvent.image.url})`,
                backgroundSize: "cover",
                overflow: "hidden",
              }}
              ref={setImage}
            >
              {room.lastEvent.serializedScreens
                .filter((screen) => screen.homography)
                .map((screenLocal, i) => (
                  <ScreenVisualization
                    key={screenLocal.id}
                    screen={screenLocal}
                    imageBounds={imageBounds}
                    top={-i * imageBounds[1]} /* I hate this SO much */
                  />
                ))}
            </Box>
          </Box>
        </Flex>
      ) : null}
    </Skeleton>
  );
}
