const CHARACTER_CLASSES = [
  { key: "lower", label: "Lowercase letter", test: /[a-z]/ },
  { key: "upper", label: "Uppercase letter", test: /[A-Z]/ },
  { key: "number", label: "Number", test: /[0-9]/ },
  { key: "symbol", label: "Symbol", test: /[^A-Za-z0-9]/ },
];

export function analyzePassword(password) {
  const checks = CHARACTER_CLASSES.map(({ key, label, test }) => ({
    key,
    label,
    passed: test.test(password),
  }));

  const classesUsed = checks.filter((check) => check.passed).length;
  let poolSize = 0;
  if (checks[0].passed) poolSize += 26;
  if (checks[1].passed) poolSize += 26;
  if (checks[2].passed) poolSize += 10;
  if (checks[3].passed) poolSize += 33;

  const entropy = password.length > 0 && poolSize > 0 ? password.length * Math.log2(poolSize) : 0;
  const lengthScore = password.length >= 16 ? 2 : password.length >= 12 ? 1 : 0;
  const score = Math.min(5, Number(lengthScore) + classesUsed);

  let label = "Very weak";
  if (password.length === 0) label = "Waiting for input";
  else if (score >= 5 && entropy >= 60) label = "Strong";
  else if (score >= 4 && entropy >= 40) label = "Good";
  else if (score >= 3 && entropy >= 28) label = "Fair";
  else if (score >= 2) label = "Weak";

  return {
    checks,
    entropy: Math.round(entropy),
    classesUsed,
    score,
    label,
    lengthOk: password.length >= 12,
  };
}
