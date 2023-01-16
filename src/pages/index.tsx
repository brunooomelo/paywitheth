import {
  Flex,
  Heading,
  Button,
  Container,
  Stack,
  Image,
  Card,
  CardBody,
  Text,
  Badge,
  CardFooter,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

import { ethers } from "ethers";

export async function payWithMetamask(
  sender: string,
  receiver: string,
  strEther: any
) {
  let ethereum = window.ethereum;

  if (!ethereum?.enable) return;
  // Request account access if needed
  await ethereum?.enable();

  let provider = new ethers.providers.Web3Provider(ethereum);

  // Acccounts now exposed
  const params = [
    {
      from: sender,
      to: receiver,
      value: ethers.utils.parseUnits(strEther, "ether").toHexString(),
    },
  ];

  const transactionHash = await provider.send("eth_sendTransaction", params);
  return transactionHash;
}

const NFT = ({ refetch, wallet, ...data }) => {
  const buyProduct = trpc.buyProduct.useMutation({
    onSuccess: refetch,
  });
  return (
    <Card
      direction={{ base: "column" }}
      overflow="hidden"
      variant="outline"
      maxW="300px"
      key={data.id}
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%" }}
        src={data.url}
        alt={data.name}
      />

      <Stack direction="column">
        <CardBody>
          <Heading size="md">{data.name}</Heading>
          <Text py="2">ID:{data.id}</Text>
          <Text py="2">createdBy:{data.createdBy}</Text>
          {!!data.owner && data.owner.toLowerCase() !== wallet && (
            <Text py="2">owned:{data.owner}</Text>
          )}
        </CardBody>

        <CardFooter>
          {data.owner.toLowerCase() !== wallet && (
            <Button
              variant="solid"
              colorScheme="blue"
              isLoading={buyProduct.isLoading}
              onClick={() => {
                if (!wallet) return;
                payWithMetamask(wallet, data.createdBy, data.value).then(
                  (hash) =>
                    buyProduct.mutateAsync({
                      hash,
                      productId: data.id,
                    })
                );
              }}
            >
              Buy {data.value} FTM
            </Button>
          )}
          {data.owner.toLowerCase() === wallet && (
            <Badge variant="green">Owned</Badge>
          )}
        </CardFooter>
      </Stack>
    </Card>
  );
};
export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [eth, setEth] = useState(null);
  const [balance, setBalance] = useState(0);

  const produts = trpc.products.useQuery();

  const checkIsConnected = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      console.log("checkIsConnected", accounts);
      setAccount(accounts);
      window.ethereum.addListener("accountsChanged", handleAccountChanged);
      setEth(window.ethereum);
    }
  };
  const requestAccount = useCallback(async () => {
    if (!window.ethereum?.isMetaMask) {
      // toast.error("Metamask not found, please install Metamask wallet");
      return;
    }
    const accounts = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts);
  }, []);

  const setAccount = (accounts: string[]) => {
    if (!accounts.length) {
      setWallet(null);
      return;
    }
    setWallet(accounts[0]);
  };
  const handleAccountChanged = (accounts: string[]) => {
    setAccount(accounts);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getBalance = () => {
    window.ethereum
      ?.request({ method: "eth_getBalance", params: [wallet, "latest"] })
      .then((balance: number) => {
        setBalance(Number(ethers.utils.formatUnits(balance, "ether")));
      });
  };

  useEffect(() => {
    checkIsConnected();
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChanged);
    };
  }, []);

  useEffect(() => {
    if (wallet) {
      getBalance();
    }
  }, [getBalance, wallet]);

  return (
    <Container maxW="1200px">
      <Flex justify="space-between">
        <Heading>Produtos</Heading>
        {wallet ? (
          <Button onClick={requestAccount} isDisabled>
            {balance} FTM
          </Button>
        ) : (
          <Button onClick={requestAccount}>Connect Wallet</Button>
        )}
      </Flex>
      <Flex flexWrap="wrap" gap="20px" justifyContent="center">
        {produts.data?.map((data) => (
          <NFT
            {...data}
            key={data.id}
            wallet={wallet}
            refetch={produts.refetch}
          />
        ))}
      </Flex>
    </Container>
  );
}
