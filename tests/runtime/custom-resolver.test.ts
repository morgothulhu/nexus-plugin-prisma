import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import { objectType } from 'nexus'
import { createRuntimeTestContext } from '../__client-test-context'

let ctx = createRuntimeTestContext()

it('supports custom resolver for t.crud', async () => {
  const datamodel = `
    model User {
      id    Int    @default(autoincrement()) @id
      name  String
    }
  `
  const User = objectType({
    name: 'User',
    definition(t: any) {
      t.model.id()
      t.model.name()
    },
  })

  const before = jest.fn()
  const after = jest.fn()

  const Query = objectType({
    name: 'Query',
    definition(t: any) {
      t.crud.users({
        resolve: async (
          root: unknown,
          args: unknown,
          ctx: unknown,
          info: GraphQLResolveInfo,
          originalResolve: GraphQLFieldResolver<any, any, any>
        ) => {
          before()
          const res = (await originalResolve(root, args, ctx, info)) as unknown[]
          after()
          return [...res, { id: 2 }]
        },
      })
    },
  })

  const { graphqlClient, dbClient } = await ctx.setup({
    datamodel,
    types: [Query, User],
  })

  await dbClient.user.create({
    data: {
      name: 'Foo',
    },
  })

  const result = await graphqlClient.request(`{
    users {
      id
    }
  }`)

  expect(before).toBeCalled()
  expect(after).toBeCalled()
  expect(result).toMatchSnapshot()
})

it('supports custom resolver for t.model', async () => {
  const datamodel = `
    model User {
      id    Int    @default(autoincrement()) @id
      name  String
    }
  `

  const before = jest.fn()
  const after = jest.fn()

  const User = objectType({
    name: 'User',
    definition(t: any) {
      t.model.id()
      t.model.name({
        resolve: async (
          root: unknown,
          args: unknown,
          ctx: unknown,
          info: GraphQLResolveInfo,
          originalResolve: GraphQLFieldResolver<any, any, any>
        ) => {
          before()
          const res = await originalResolve(root, args, ctx, info)
          after()
          return res + ' (updated by middleware)'
        },
      })
    },
  })

  const Query = objectType({
    name: 'Query',
    definition(t: any) {
      t.crud.users()
    },
  })

  const { graphqlClient, dbClient } = await ctx.setup({
    datamodel,
    types: [Query, User],
  })
  await dbClient.user.create({
    data: {
      name: 'Foo',
    },
  })

  const result = await graphqlClient.request(`{
    users {
      name
    }
  }`)

  expect(before).toBeCalled()
  expect(after).toBeCalled()
  expect(result).toMatchSnapshot()
})
