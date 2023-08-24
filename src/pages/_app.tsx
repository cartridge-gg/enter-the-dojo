import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { DojoProvider } from "@/hooks/dojo";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <DojoProvider>
          <Component {...pageProps} />
        </DojoProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
