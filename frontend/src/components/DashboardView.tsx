import { Box, Button, Flex, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Calculator, LogOut, Plus } from 'lucide-react';
import type { AuthUser } from '../lib/api';

export type ActiveTool = 'home' | 'sum' | 'calculator';

interface DashboardViewProps {
  user: AuthUser;
  onSelectTool: (tool: ActiveTool) => void;
  onLogout: () => void;
}

export function DashboardView({ user, onSelectTool, onLogout }: DashboardViewProps) {
  return (
    <Box minH="100vh" px={{ base: 4, md: 8 }} py={6}>
      <Flex
        maxW="900px"
        mx="auto"
        justify="space-between"
        align="center"
        pb={6}
        mb={10}
        borderBottom="1px solid"
        borderColor="whiteAlpha.150"
      >
        <VStack align="start" spacing={0}>
          <Heading size="md" fontWeight="bold">
            Workspace
          </Heading>
          <Text fontSize="sm" color="gray.400">
            Signed in as{' '}
            <Text as="span" color="blue.300" fontWeight="semibold">
              {user.fullName ? `${user.fullName} (@${user.username})` : user.username}
            </Text>
          </Text>
        </VStack>

        <Button
          leftIcon={<LogOut size={16} />}
          variant="outline"
          size="sm"
          borderColor="whiteAlpha.250"
          _hover={{ bg: 'whiteAlpha.100' }}
          onClick={onLogout}
        >
          Sign Out
        </Button>
      </Flex>

      <VStack maxW="720px" mx="auto" spacing={8} align="stretch">
        <VStack spacing={2} textAlign="center">
          <Heading size="xl">Choose a Tool</Heading>
          <Text color="gray.400" fontSize="md">
            Select an option below to get started.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
          <Button
            h="200px"
            borderRadius="2xl"
            bg="gray.900"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{
              bg: 'gray.800',
              borderColor: 'blue.400',
              transform: 'translateY(-3px)',
            }}
            transition="all 0.2s ease"
            onClick={() => onSelectTool('sum')}
          >
            <VStack spacing={4}>
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
              <VStack spacing={1}>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Sum
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                  Open the Sum module
                </Text>
              </VStack>
            </VStack>
          </Button>

          <Button
            h="200px"
            borderRadius="2xl"
            bg="gray.900"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{
              bg: 'gray.800',
              borderColor: 'orange.400',
              transform: 'translateY(-3px)',
            }}
            transition="all 0.2s ease"
            onClick={() => onSelectTool('calculator')}
          >
            <VStack spacing={4}>
              <Flex
                w={16}
                h={16}
                borderRadius="2xl"
                bg="orange.500"
                color="white"
                align="center"
                justify="center"
              >
                <Calculator size={32} />
              </Flex>
              <VStack spacing={1}>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Calculator
                </Text>
                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                  Mobile-style calculator
                </Text>
              </VStack>
            </VStack>
          </Button>
        </SimpleGrid>

        <HStack justify="center" pt={2}>
          <Text fontSize="xs" color="gray.600">
            Secured with Supabase, bcrypt, and HttpOnly JWT sessions
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
