#!/usr/bin/env zx
import fs from 'fs/promises'

async function npmInstall ()  {
    await $`npm install husky -D --silent`
    await $`npm install @commitlint/cli -D --silent`
    await $`npm install @commitlint/config-conventional -D --silent`
    await $`npm install lint-staged -D --silent`

    await $`npm pkg set scripts.prepare="husky install"`
    await $`npm run prepare`
}

async function setCommitLintConfig () {
    await fs.writeFile(
        'commitlint.config.js',
        [
            `module.exports = { extends : ['@commitlint/config-conventional'] }`,
            ''
        ].join('\n'),
    )
}

async function setLintStagedConfig () {
    const pakageJson = await fs.readFile('package.json')
    const pkg = JSON.parse(pakageJson)
    pkg['lint-staged'] = {
        "*.{ts,tsx}": "npm run lint:only"
    }
    
    await fs.writeFile('package.json', JSON.stringify(pkg, null, 2))
}

async function addGitHooks () {
    const command = 'npx --no -- commitlint --edit "$1"'

    await $`npx husky add .husky/pre-commit "npx lint-staged"`
    await $`npx husky add .husky/pre-push "npx run test"`
    await $`npx husky add .husky/commit-msg  'npx --no -- commitlint --edit "\$1"'`
}

await npmInstall()
await setCommitLintConfig()
await setLintStagedConfig()
await addGitHooks()


