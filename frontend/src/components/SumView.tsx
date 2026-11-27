import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft, Plus } from 'lucide-react';

interface SumViewProps {
  onBack: () => void;
}

export function SumView({ onBack }: SumViewProps) {
  return (
    <Flex minH="100vh" align="center" justify="center" px={4} py={8}>
      <Box
        w="full"
        maxW="480px"
        bg="gray.900"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="2xl"
        p={8}
        textAlign="center"
        boxShadow="0 24px 60px rgba(0, 0, 0, 0.5)"
      >
        <VStack spacing={5}>
          <Flex
            w={16}
            h={16}
            borderRadius="2xl"
            bg="blue.500"
            color="white"
            align="center"
            justify="center"
          >
            <Plus size={32} />
          </Flex>
          <Heading size="lg">Sum Module</Heading>
          <Text color="gray.400" fontSize="md">
            This section is ready for the custom Sum feature you want to build next.
          </Text>
          <Button
            leftIcon={<ArrowLeft size={18} />}
            colorScheme="blue"
            variant="outline"
            onClick={onBack}
            mt={2}
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
