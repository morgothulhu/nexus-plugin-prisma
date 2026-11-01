import * as semver from 'semver'
import { colors } from './colors'

const pkgJson = require('../package.json')

export function ensureDepIsInstalled(depName: string, paths?: string[]) {
  try {
    // Resolve the manifest instead of requiring the package so that we only check that it is installed,
    // without executing its entry point. @prisma/client's entry point requires `.prisma/client/default`,
    // which does not exist when the client is generated to a custom output.
    require.resolve(`${depName}/package.json`, paths ? { paths } : undefined)
  } catch (rawErr) {
    const err = rawErr as { code?: string }
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error(
        `${colors.red('ERROR:')} ${colors.green(
          depName
        )} must be installed as a dependency. Please run \`${colors.green(`npm install ${depName}`)}\`.`
      )
      process.exit(1)
    } else {
      throw err
    }
  }
}

export function ensurePeerDepRangeSatisfied(depName: string) {
  try {
    const installedVersion: string | undefined = require(`${depName}/package.json`).version

    // npm enforces that package manifests have a valid "version" field so this case _should_ never happen under normal circumstances.
    if (!installedVersion) {
      console.warn(
        colors.yellow(
          `Warning: No version found for "${depName}". We cannot check if the consumer has satisfied the specified range.`
        )
      )
      return
    }

    const supportedRange: string | undefined = pkgJson.peerDependencies[depName]

    if (!supportedRange) {
      console.warn(
        colors.yellow(
          `Warning: nexus-plugin-prisma has no such peer dependency for "${depName}". We cannot check if the consumer has satisfied the specified range.`
        )
      )
      return
    }

    if (semver.satisfies(installedVersion, supportedRange)) {
      return
    }

    console.warn(
      colors.yellow(
        `Warning: nexus-plugin-prisma@${pkgJson.version} does not support ${depName}@${installedVersion}. The supported range is: \`${supportedRange}\`. This could lead to undefined behaviors and bugs.`
      )
    )
  } catch {}
}
