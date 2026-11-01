import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import jetpack from 'fs-jetpack'
import { ensureDepIsInstalled } from '../../src/deps'

describe('ensureDepIsInstalled', () => {
  let fixtureDir: string
  let exitSpy: jest.SpyInstance
  let errorSpy: jest.SpyInstance

  beforeAll(() => {
    // Built at runtime because `node_modules` dirs are git-ignored at any depth
    fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexus-plugin-prisma-deps-'))
    const pkgDir = jetpack.cwd(fixtureDir).dir('node_modules/broken-client')
    pkgDir.write('package.json', { name: 'broken-client', version: '1.0.0', main: 'index.js' })
    // Mimics @prisma/client/default.js when the client was generated to a custom output
    pkgDir.write('index.js', `module.exports = require('.missing-generated/default')\n`)
  })

  afterAll(() => {
    jetpack.remove(fixtureDir)
  })

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit(${code})`)
    }) as any)
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    exitSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('does not report an installed package whose entry point requires a missing module', () => {
    expect(() => ensureDepIsInstalled('broken-client', [fixtureDir])).not.toThrow()
    expect(exitSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('reports a package that is not installed and exits', () => {
    expect(() => ensureDepIsInstalled('not-installed-pkg', [fixtureDir])).toThrow('process.exit(1)')
    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not-installed-pkg'))
  })

  it.each(['nexus', 'graphql', '@prisma/client'])('accepts installed peer dependency %s', (depName) => {
    expect(() => ensureDepIsInstalled(depName)).not.toThrow()
    expect(exitSpy).not.toHaveBeenCalled()
  })
})
