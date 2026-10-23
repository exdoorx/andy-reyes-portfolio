const fmt = (n) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(6)));

function tokenize(source) {
  const raw = source
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .toLowerCase();

  const tokens = [];
  for (let i = 0; i < raw.length; ) {
    const char = raw[i];
    if (/[0-9.]/.test(char)) {
      let end = i;
      while (end < raw.length && /[0-9.]/.test(raw[end])) end += 1;
      const value = Number.parseFloat(raw.slice(i, end));
      if (Number.isNaN(value)) throw new Error("That number is not valid.");
      tokens.push({ type: "number", value });
      i = end;
    } else if (char === "x") {
      tokens.push({ type: "variable" });
      i += 1;
    } else if ("+-*/^()".includes(char)) {
      tokens.push({ type: char });
      i += 1;
    } else {
      throw new Error(`I don't understand "${char}".`);
    }
  }

  // Insert multiplication for implicit forms such as 3(x + 2) or 2x.
  const normalized = [];
  tokens.forEach((token) => {
    const previous = normalized[normalized.length - 1];
    const startsValue = ["number", "variable", "("].includes(token.type);
    const previousEndsValue = previous && ["number", "variable", ")"].includes(previous.type);
    if (startsValue && previousEndsValue) normalized.push({ type: "*" });
    normalized.push(token);
  });

  return normalized;
}

function makeEvaluator(source) {
  const tokens = tokenize(source);

  return (xValue) => {
    let position = 0;
    const peek = () => tokens[position]?.type;
    const eat = () => tokens[position++];

    function expression() {
      let value = term();
      while (peek() === "+" || peek() === "-") {
        value = eat().type === "+" ? value + term() : value - term();
      }
      return value;
    }

    function term() {
      let value = power();
      while (peek() === "*" || peek() === "/") {
        const op = eat().type;
        const right = power();
        if (op === "/" && right === 0) throw new Error("Can't divide by zero.");
        value = op === "*" ? value * right : value / right;
      }
      return value;
    }

    function power() {
      const base = unary();
      if (peek() === "^") {
        eat();
        return Math.pow(base, power());
      }
      return base;
    }

    function unary() {
      if (peek() === "-") {
        eat();
        return -unary();
      }
      if (peek() === "+") {
        eat();
        return unary();
      }
      return atom();
    }

    function atom() {
      const token = eat();
      if (!token) throw new Error("The expression ended too early.");
      if (token.type === "number") return token.value;
      if (token.type === "variable") return xValue;
      if (token.type === "(") {
        const value = expression();
        if (eat()?.type !== ")") throw new Error("Missing a closing parenthesis.");
        return value;
      }
      throw new Error("Unexpected symbol.");
    }

    const result = expression();
    if (position < tokens.length) throw new Error("Unexpected symbol.");
    return result;
  };
}

export function solveExpression(text) {
  const source = text.trim();
  if (!source) throw new Error("Type a problem first.");
  const parts = source.split("=");
  if (parts.length > 2) throw new Error("Use only one equals sign.");

  if (parts.length === 1) {
    if (/x/i.test(source)) {
      throw new Error("Add an equals sign to solve for x, for example 2x + 3 = 11.");
    }
    const value = makeEvaluator(source)(0);
    if (!Number.isFinite(value)) throw new Error("That result is not a finite number.");
    return {
      steps: [`Evaluate the expression with standard operator precedence.`],
      answer: fmt(value),
    };
  }

  const left = makeEvaluator(parts[0]);
  const right = makeEvaluator(parts[1]);
  const difference = (x) => left(x) - right(x);
  const intercept = difference(0);
  const slope = difference(1) - intercept;

  if (Math.abs(difference(2) - (2 * slope + intercept)) > 1e-9) {
    throw new Error("This demo solves linear equations only, such as 3x - 5 = 10.");
  }
  if (Math.abs(slope) < 1e-12) {
    throw new Error(
      Math.abs(intercept) < 1e-12 ? "Every value of x works." : "This equation has no solution.",
    );
  }

  const x = -intercept / slope;
  return {
    steps: [
      `Move everything to one side: ${fmt(slope)}x ${intercept < 0 ? "−" : "+"} ${fmt(Math.abs(intercept))} = 0`,
      `Move the constant: ${fmt(slope)}x = ${fmt(-intercept)}`,
      `Divide both sides by ${fmt(slope)}.`,
    ],
    answer: `x = ${fmt(x)}`,
  };
}
