import { Text } from "@mantine/core";

export default async function Config({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = (await params).id;
  return <Text>ID: {id}</Text>;
}
