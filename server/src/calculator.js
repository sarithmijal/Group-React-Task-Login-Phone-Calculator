// Evaluador seguro de expresiones aritméticas (sin eval ni Function).
// Soporta: números decimales, + - * /, paréntesis y signo negativo (ej. -5, 3*-2).

export class CalcError extends Error {}

function tokenizar(expresion) {
  const tokens = [];
  let i = 0;
  while (i < expresion.length) {
    const c = expresion[i];
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let num = '';
      while (i < expresion.length && /[0-9.]/.test(expresion[i])) {
        num += expresion[i++];
      }
      if ((num.match(/\./g) || []).length > 1 || num === '.') {
        throw new CalcError(`Número inválido: ${num}`);
      }
      tokens.push({ tipo: 'num', valor: Number(num) });
      continue;
    }
    if ('+-*/()'.includes(c)) {
      tokens.push({ tipo: 'op', valor: c });
      i++;
      continue;
    }
    throw new CalcError(`Carácter no permitido: ${c}`);
  }
  return tokens;
}

// Parser recursivo:
// expr    = termino (('+'|'-') termino)*
// termino = factor (('*'|'/') factor)*
// factor  = ('-'|'+') factor | num | '(' expr ')'
export function calcular(expresion) {
  if (typeof expresion !== 'string' || expresion.trim() === '') {
    throw new CalcError('La expresión está vacía');
  }
  if (expresion.length > 200) {
    throw new CalcError('La expresión es demasiado larga');
  }

  const tokens = tokenizar(expresion);
  let pos = 0;
  const ver = () => tokens[pos];
  const esOp = (op) => ver()?.tipo === 'op' && ver().valor === op;

  function expr() {
    let valor = termino();
    while (esOp('+') || esOp('-')) {
      const op = tokens[pos++].valor;
      const der = termino();
      valor = op === '+' ? valor + der : valor - der;
    }
    return valor;
  }

  function termino() {
    let valor = factor();
    while (esOp('*') || esOp('/')) {
      const op = tokens[pos++].valor;
      const der = factor();
      if (op === '/' && der === 0) throw new CalcError('División para cero');
      valor = op === '*' ? valor * der : valor / der;
    }
    return valor;
  }

  function factor() {
    const t = ver();
    if (!t) throw new CalcError('Expresión incompleta');
    if (esOp('-')) {
      pos++;
      return -factor();
    }
    if (esOp('+')) {
      pos++;
      return factor();
    }
    if (t.tipo === 'num') {
      pos++;
      return t.valor;
    }
    if (esOp('(')) {
      pos++;
      const valor = expr();
      if (!esOp(')')) throw new CalcError('Falta cerrar un paréntesis');
      pos++;
      return valor;
    }
    throw new CalcError(`Operador inesperado: ${t.valor}`);
  }

  const resultado = expr();
  if (pos < tokens.length) {
    throw new CalcError(`Sobra: ${tokens[pos].valor}`);
  }
  // Redondeo para evitar cosas como 0.1 + 0.2 = 0.30000000000000004
  return Math.round(resultado * 1e10) / 1e10;
}

export function sumar(num1, num2) {
  const a = Number(num1);
  const b = Number(num2);
  if (num1 === '' || num2 === '' || num1 == null || num2 == null || Number.isNaN(a) || Number.isNaN(b)) {
    throw new CalcError('num1 y num2 deben ser números');
  }
  return Math.round((a + b) * 1e10) / 1e10;
}
