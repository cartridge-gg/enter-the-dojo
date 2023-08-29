import { Header } from "@/components/Header";
import { useAvailableGamesQuery } from "@/generated/graphql";
import { formatAddress } from "@/utils/contract";
import { Flex, Heading, Text, VStack, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Games() {
  const { data, isFetching } = useAvailableGamesQuery({
    limit: 10,
  });

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      boxSize="full"
      justify="center"
      align="center"
      bgColor="gray.300"
    >
      <Header />
      <VStack spacing="20px">
        <Heading size="lg">Games</Heading>
        {data?.gameComponents?.edges?.map((edge) => {
          const gameId = edge?.node?.entity?.keys?.[0];
          const creator = edge?.node?.player_one;
          return (
            <Link as={NextLink} href={`/${gameId}`}>
              {" "}
              <strong>{formatAddress(creator)}</strong> in game{" "}
              <strong>{gameId} </strong>is waiting for a challenger!
            </Link>
          );
        })}
      </VStack>
    </Flex>
  );
}
