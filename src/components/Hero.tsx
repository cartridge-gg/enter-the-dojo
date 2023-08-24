import { Box, Image, Text, keyframes } from "@chakra-ui/react";
import { useState } from "react";

export enum HeroType {
  One = "hero_1",
  Two = "hero_2",
}

enum State {
  IDLE = "idle",
  ATTACK_ONE = "attack_one",
  ATTACK_TWO = "attack_two",
  SPECIAL = "special",
  TAKE_HIT = "take_hit",
}

const animation = keyframes`
  100% {
    background-position: -1600px
  }
`;

export const Hero = ({
  type,
  isMirrored = false,
}: {
  type: HeroType;
  isMirrored?: boolean;
}) => {
  const [state, setState] = useState<State>(State.IDLE);

  return (
    <>
      <Box
        boxSize="200px"
        background={`url('/${type}/${state}.png') left center`}
        animation={`${animation} 1s steps(8) infinite`}
        transform={isMirrored ? "scaleX(-1)" : ""}
      />
    </>
  );
};
