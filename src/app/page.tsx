import { HydrateClient } from "@/trpc/server";
import { Center, Paper } from "@mantine/core";
import { Onboard } from "@/app/_components/Onboard";
import style from "./page.module.css";

export default async function Home() {
  return (
    <HydrateClient>
      <Center h="100dvh">
        <Paper
          w={{
            base: "100%",
            sm: "24rem",
          }}
          shadow="md"
          radius="md"
          p="lg"
          className={style.paper}
        >
          <Onboard />
        </Paper>
      </Center>
    </HydrateClient>
  );
}
