import { ensureDepIsInstalled, ensurePeerDepRangeSatisfied } from './deps'

ensureDepIsInstalled('nexus')
ensureDepIsInstalled('graphql')
ensureDepIsInstalled('@prisma/client')

// TODO: Bring back peer dep range check for graphql once we have proper ranges
// TODO: They're currently way too conservative

//ensurePeerDepRangeSatisfied('graphql')
ensurePeerDepRangeSatisfied('nexus')
ensurePeerDepRangeSatisfied('@prisma/client')

export * from './plugin'
