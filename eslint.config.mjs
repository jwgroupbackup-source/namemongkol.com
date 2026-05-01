import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noPathInAltRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow path/URL-like values in image alt text. Alt text must describe image meaning.",
    },
    schema: [],
    messages: {
      noPathLiteral:
        "Do not use file paths or URLs as alt text. Use a descriptive phrase.",
      noPathIdentifier:
        "Avoid using raw path/url variables directly in alt text. Use a human-readable description instead.",
    },
  },
  create(context) {
    const isPathLike = (value) => {
      if (typeof value !== "string") {
        return false;
      }

      const normalized = value.trim();
      if (!normalized) {
        return false;
      }

      if (/^(https?:\/\/|\/)/i.test(normalized)) {
        return true;
      }

      return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(normalized);
    };

    const isPathIdentifier = (name) => /^(imagePath|path|url|src)$/i.test(name);

    const reportLiteralIfNeeded = (node, value) => {
      if (isPathLike(value)) {
        context.report({ node, messageId: "noPathLiteral" });
      }
    };

    return {
      JSXAttribute(node) {
        if (node.name?.name !== "alt" || !node.value) {
          return;
        }

        if (node.value.type === "Literal") {
          reportLiteralIfNeeded(node.value, node.value.value);
          return;
        }

        if (node.value.type !== "JSXExpressionContainer") {
          return;
        }

        const expression = node.value.expression;
        if (!expression) {
          return;
        }

        if (expression.type === "Literal") {
          reportLiteralIfNeeded(expression, expression.value);
          return;
        }

        if (expression.type === "TemplateLiteral" && expression.expressions.length === 0) {
          reportLiteralIfNeeded(expression, expression.quasis[0]?.value?.cooked ?? "");
          return;
        }

        if (expression.type === "Identifier" && isPathIdentifier(expression.name)) {
          context.report({ node: expression, messageId: "noPathIdentifier" });
        }
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      aeo: {
        rules: {
          "no-path-in-alt": noPathInAltRule,
        },
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "aeo/no-path-in-alt": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
    "scratch/**",
    "*.js",
  ]),
]);

export default eslintConfig;
