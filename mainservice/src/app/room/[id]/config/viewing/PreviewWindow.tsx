import { useContext } from "react";
import roomContext from "../../_contexts/roomContext";
import { Box, Flex } from "@mantine/core";
import { ScreenContent } from "../../ScreenContent";
import style from "@/app/page.module.css";

export default function PreviewWindow() {
  const room = useContext(roomContext);

  if (room?.lastEvent.image === undefined) {
    return;
  }

  return (
    <Flex direction="column" w="100%">
      <Flex
        w="100%"
        maw="100%"
        style={{
          aspectRatio: 16 / 9,
          borderRadius: "0.5rem",
        }}
        justify="center"
        align="center"
        className={style.paper}
      >
        <Box
          style={{
            aspectRatio:
              room.lastEvent.image.width / room.lastEvent.image.height,
            maxWidth: "100%",
            maxHeight: "100%",
            backgroundColor:
              "color-mix(in srgb, var(--mantine-color-dark-filled) 75%, black)",
            overflow: "none",
          }}
        >
          <ScreenContent />
        </Box>
      </Flex>
      <Flex direction="row">TODO: Video controls here</Flex>
    </Flex>
  );
}
