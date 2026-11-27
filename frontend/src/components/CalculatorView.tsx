import { Box, Button, Flex, Grid, GridItem, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft, Delete } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface CalculatorViewProps {
  onBack: () => void;
}

type Operator = '+' | '-' | '×' | '÷';

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Number.parseFloat(value.toPrecision(12));
  const str = String(rounded);
  if (str.length > 12) {
    return rounded.toExponential(6);
  }
  return str;
}

function compute(left: number, right: number, op: Operator): number {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '×':
      return left * right;
    case '÷':
      return right === 0 ? Number.NaN : left / right;
  }
}

export function CalculatorView({ onBack }: CalculatorViewProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      if (display === 'Error') {
        setDisplay(digit);
        setWaitingForOperand(false);
        return;
      }

      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay((prev) => (prev === '0' ? digit : prev.length < 12 ? prev + digit : prev));
      }
    },
    [display, waitingForOperand],
  );

  const inputDecimal = useCallback(() => {
    if (display === 'Error') {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  }, [display, waitingForOperand]);

  const backspace = useCallback(() => {
    if (waitingForOperand || display === 'Error') return;
    setDisplay((prev) => (prev.length <= 1 || (prev.length === 2 && prev.startsWith('-')) ? '0' : prev.slice(0, -1)));
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    if (display === '0' || display === 'Error') return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  }, [display]);

  const applyPercent = useCallback(() => {
    if (display === 'Error') return;
    const current = Number.parseFloat(display);
    setDisplay(formatNumber(current / 100));
  }, [display]);

  const handleOperator = useCallback(
    (nextOp: Operator) => {
      if (display === 'Error') return;
      const inputValue = Number.parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(inputValue);
        setExpression(`${formatNumber(inputValue)} ${nextOp}`);
      } else if (operator && !waitingForOperand) {
        const result = compute(previousValue, inputValue, operator);
        const formatted = formatNumber(result);
        setDisplay(formatted);
        setPreviousValue(Number.isFinite(result) ? result : null);
        setExpression(Number.isFinite(result) ? `${formatted} ${nextOp}` : '');
      } else {
        setExpression(`${formatNumber(previousValue)} ${nextOp}`);
      }

      setWaitingForOperand(true);
      setOperator(nextOp);
    },
    [display, operator, previousValue, waitingForOperand],
  );

  const handleEquals = useCallback(() => {
    if (operator === null || previousValue === null || display === 'Error') return;
    const inputValue = Number.parseFloat(display);
    const result = compute(previousValue, inputValue, operator);
    const formatted = formatNumber(result);

    setExpression(`${formatNumber(previousValue)} ${operator} ${formatNumber(inputValue)} =`);
    setDisplay(formatted);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, operator, previousValue]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        applyPercent();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [applyPercent, backspace, clearAll, handleEquals, handleOperator, inputDecimal, inputDigit]);

  const displayFontSize = display.length > 9 ? '3xl' : display.length > 6 ? '4xl' : '5xl';
  const showClearEntry = display !== '0' && !waitingForOperand;

  const numBtnStyle = {
    h: '66px',
    borderRadius: 'full',
    bg: '#2c2c2e',
    color: 'white',
    fontSize: '2xl',
    fontWeight: 'medium',
    _hover: { bg: '#3a3a3c' },
    _active: { bg: '#48484a', transform: 'scale(0.96)' },
  } as const;

  const funcBtnStyle = {
    h: '66px',
    borderRadius: 'full',
    bg: '#a5a5a5',
    color: '#000000',
    fontSize: 'xl',
    fontWeight: 'semibold',
    _hover: { bg: '#bdbdbd' },
    _active: { bg: '#d4d4d4', transform: 'scale(0.96)' },
  } as const;

  const opBtnStyle = (op: Operator) => {
    const isActive = operator === op && waitingForOperand;
    return {
      h: '66px',
      borderRadius: 'full',
      bg: isActive ? 'white' : '#ff9f0a',
      color: isActive ? '#ff9f0a' : 'white',
      fontSize: '2xl',
      fontWeight: 'semibold',
      _hover: { bg: isActive ? 'white' : '#ffb340' },
      _active: { transform: 'scale(0.96)' },
    } as const;
  };

  return (
    <Flex minH="100vh" direction="column" align="center" justify="center" px={4} py={6}>
      <VStack spacing={4} w="full" maxW="340px">
        <HStack w="full" justify="space-between">
          <Button
            leftIcon={<ArrowLeft size={16} />}
            variant="ghost"
            size="sm"
            color="gray.300"
            onClick={onBack}
          >
            Back
          </Button>
          <Text fontSize="xs" color="gray.500" fontWeight="medium" letterSpacing="wider">
            CALCULATOR
          </Text>
        </HStack>

        <Box
          w="full"
          bg="#000000"
          borderRadius="36px"
          p={5}
          border="2px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 28px 70px rgba(0, 0, 0, 0.75)"
        >
          {/* Display */}
          <VStack align="end" justify="end" minH="128px" px={2} pb={4} spacing={1}>
            <HStack w="full" justify="space-between" align="center">
              <IconButton
                aria-label="Backspace"
                icon={<Delete size={18} />}
                variant="ghost"
                size="sm"
                color="gray.500"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={backspace}
              />
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {expression || '\u00A0'}
              </Text>
            </HStack>
            <Text
              fontSize={displayFontSize}
              fontWeight="light"
              color="white"
              lineHeight="1.1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
              noOfLines={1}
            >
              {display}
            </Text>
          </VStack>

          {/* Keypad */}
          <Grid templateColumns="repeat(4, 1fr)" gap={3}>
            <GridItem>
              <Button w="full" {...funcBtnStyle} onClick={showClearEntry ? () => setDisplay('0') : clearAll}>
                {showClearEntry ? 'C' : 'AC'}
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" {...funcBtnStyle} onClick={toggleSign}>
                ±
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" {...funcBtnStyle} onClick={applyPercent}>
                %
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" {...opBtnStyle('÷')} onClick={() => handleOperator('÷')}>
                ÷
              </Button>
            </GridItem>

            {['7', '8', '9'].map((digit) => (
              <GridItem key={digit}>
                <Button w="full" {...numBtnStyle} onClick={() => inputDigit(digit)}>
                  {digit}
                </Button>
              </GridItem>
            ))}
            <GridItem>
              <Button w="full" {...opBtnStyle('×')} onClick={() => handleOperator('×')}>
                ×
              </Button>
            </GridItem>

            {['4', '5', '6'].map((digit) => (
              <GridItem key={digit}>
                <Button w="full" {...numBtnStyle} onClick={() => inputDigit(digit)}>
                  {digit}
                </Button>
              </GridItem>
            ))}
            <GridItem>
              <Button w="full" {...opBtnStyle('-')} onClick={() => handleOperator('-')}>
                −
              </Button>
            </GridItem>

            {['1', '2', '3'].map((digit) => (
              <GridItem key={digit}>
                <Button w="full" {...numBtnStyle} onClick={() => inputDigit(digit)}>
                  {digit}
                </Button>
              </GridItem>
            ))}
            <GridItem>
              <Button w="full" {...opBtnStyle('+')} onClick={() => handleOperator('+')}>
                +
              </Button>
            </GridItem>

            <GridItem colSpan={2}>
              <Button
                w="full"
                {...numBtnStyle}
                justifyContent="flex-start"
                pl={7}
                onClick={() => inputDigit('0')}
              >
                0
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" {...numBtnStyle} onClick={inputDecimal}>
                .
              </Button>
            </GridItem>
            <GridItem>
              <Button
                w="full"
                h="66px"
                borderRadius="full"
                bg="#ff9f0a"
                color="white"
                fontSize="2xl"
                fontWeight="semibold"
                _hover={{ bg: '#ffb340' }}
                _active={{ transform: 'scale(0.96)' }}
                onClick={handleEquals}
              >
                =
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </VStack>
    </Flex>
  );
}
