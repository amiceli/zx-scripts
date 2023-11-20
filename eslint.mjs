#!/usr/bin/env zx
import fs from 'fs/promises'

async function npmInstall() {
    await $`npm install eslint@8.54.0 -D --silent`
    await $`npm install eslint-plugin-vue -D --silent`
    await $`npm install @amiceli/eslint-config-base -D --silent`
    await $`npm install @amiceli/eslint-config-typescript -D --silent`
    await $`npm install @amiceli/eslint-config-vue -D --silent`
    await $`npm install @vue/eslint-config-typescript -D --silent`
    await $`npm install @typescript-eslint/eslint-plugin -D --silent`
    await $`npm install @typescript-eslint/parser -D --silent`
}

async function setPackageEslintConfig() {
    const pakageJson = await fs.readFile('package.json')
    const pkg = JSON.parse(pakageJson)
    pkg.scripts = {
        ...pkg.scripts,
        "lint": "eslint -c .eslintrc.cjs src/",
        "lint:only": "eslint -c .eslintrc.cjs",
        "lint:fix": "eslint -c .eslintrc.cjs src/ --fix",
    }

    await fs.writeFile('package.json', JSON.stringify(pkg, null, 2))
}

async function setEslintConfig() {
    const eslintConfig = {
        root: true,
        env: {
            node: true,
        },
        extends: [
            `@amiceli/eslint-config-base`,
            `@amiceli/eslint-config-vue`,
        ],
        rules: {
            "import/no-extraneous-dependencies": [
                `error`,
                {
                    devDependencies: [
                        `**/*.spec.ts`,
                        `**/*.spec.tsx`,
                        `vite.config.ts`,
                        `vitest.setup.ts`,
                    ],
                },
            ],
        },
        overrides: [
            {
                files: [`¨**/*.ts`],
                extends: [
                    `@amiceli/eslint-config-typescript`,
                ],
                parserOptions: {
                    parser: `@typescript-eslint/parser`,
                    ecmaVersion: 2020,
                },
            },
        ],

    }

    await fs.writeFile('.eslintrc.cjs',
        `module.exports = ${JSON.stringify(eslintConfig, null, 4)}`
    )
}

await npmInstall()
await setPackageEslintConfig()
await setEslintConfig()