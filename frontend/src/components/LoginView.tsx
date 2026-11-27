import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { authApi, type AuthUser } from '../lib/api';

interface LoginViewProps {
  onSuccess: (user: AuthUser) => void;
}

export function LoginView({ onSuccess }: LoginViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response =
        mode === 'login'
          ? await authApi.login(username, password)
          : await authApi.register(fullName, email, username, password);
      onSuccess(response.user);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" px={4} py={8}>
      <Box
        w="full"
        maxW="420px"
        bg="gray.900"
        border="1px solid"
        borderColor="whiteAlpha.150"
        borderRadius="2xl"
        p={{ base: 6, sm: 8 }}
        boxShadow="0 24px 60px rgba(0, 0, 0, 0.55)"
      >
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Flex
              w={12}
              h={12}
              borderRadius="xl"
              bg="blue.500"
              color="white"
              align="center"
              justify="center"
              mb={1}
            >
              <Lock size={22} />
            </Flex>
            <Heading size="lg" fontWeight="bold" letterSpacing="tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Heading>
            <Text fontSize="sm" color="gray.400">
              {mode === 'login'
                ? 'Sign in with your username and password'
                : 'Fill in your details to create a new account'}
            </Text>
          </VStack>

          {errorMessage && (
            <Alert status="error" borderRadius="lg" bg="red.900" color="red.100" fontSize="sm">
              <AlertIcon color="red.300" />
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {mode === 'register' && (
                <>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="gray.300">
                      Full Name
                    </FormLabel>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      bg="gray.950"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'whiteAlpha.400' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #63b3ed' }}
                      size="lg"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" color="gray.300">
                      Email
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      bg="gray.950"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'whiteAlpha.400' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #63b3ed' }}
                      size="lg"
                    />
                  </FormControl>
                </>
              )}

              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.300">
                  Username
                </FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  bg="gray.950"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #63b3ed' }}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.300">
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    bg="gray.950"
                    borderColor="whiteAlpha.200"
                    _hover={{ borderColor: 'whiteAlpha.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #63b3ed' }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      variant="ghost"
                      size="sm"
                      color="gray.400"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isSubmitting}
                loadingText={mode === 'login' ? 'Signing in...' : 'Creating account...'}
                mt={2}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <HStack justify="center" fontSize="sm">
            <Text color="gray.400">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setMode((prev) => (prev === 'login' ? 'register' : 'login'));
              }}
            >
              {mode === 'login' ? 'Create one' : 'Sign In'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}
