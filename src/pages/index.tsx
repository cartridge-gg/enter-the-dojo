import { Header } from "@/components/Header";
import { Hero, HeroType } from "@/components/Hero";
import { Flex, HStack, Image, VStack } from "@chakra-ui/react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Enter the Dojo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          position="fixed"
          top="0"
          left="0"
          boxSize="full"
          align="center"
          justify="center"
          bgColor="gray.300"
        >
          <Header />
          <VStack>
            <Image src="/torii.png" position="relative" top="100px" />
            <HStack>
              <Hero type={HeroType.One} />
              <Hero type={HeroType.Two} isMirrored />
            </HStack>
          </VStack>
        </Flex>
      </main>
    </>
  );
}
