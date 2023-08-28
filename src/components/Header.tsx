import { useDojo } from "@/hooks/dojo";
import { formatAddress } from "@/utils/contract";
import { Button, HStack, Link, Text } from "@chakra-ui/react";

export const Header = () => {
  const { account, createBurner, isBurnerDeploying } = useDojo();
  return (
    <HStack
      position="absolute"
      top="0"
      w="full"
      p="20px"
      gap="60px"
      justify="right"
    >
      <Link>Available Games</Link>
      <Button
        isDisabled={isBurnerDeploying || account != undefined}
        isLoading={isBurnerDeploying}
        onClick={createBurner}
      >
        {account ? formatAddress(account.address) : "Create Burner"}
      </Button>
    </HStack>
  );
};
