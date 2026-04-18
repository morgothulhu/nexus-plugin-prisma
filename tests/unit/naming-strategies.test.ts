import { camelCase, defaultArgsNamingStrategy, defaultFieldNamingStrategy } from '../../src/naming-strategies'

describe('camelCase', () => {
  it('lowercases single word', () => {
    expect(camelCase('User')).toBe('user')
  })

  it('converts PascalCase to camelCase', () => {
    expect(camelCase('UserProfile')).toBe('userProfile')
  })

  it('converts hyphen-separated to camelCase', () => {
    expect(camelCase('my-model-name')).toBe('myModelName')
  })

  it('converts underscore-separated to camelCase', () => {
    expect(camelCase('my_model_name')).toBe('myModelName')
  })

  it('converts space-separated to camelCase', () => {
    expect(camelCase('my model name')).toBe('myModelName')
  })

  it('handles empty string', () => {
    expect(camelCase('')).toBe('')
  })

  it('handles already camelCase string', () => {
    expect(camelCase('alreadyCamel')).toBe('alreadyCamel')
  })

  it('handles single lowercase word', () => {
    expect(camelCase('user')).toBe('user')
  })
})

describe('defaultArgsNamingStrategy', () => {
  it('whereInput produces correct name', () => {
    expect(defaultArgsNamingStrategy.whereInput('user', 'posts')).toBe('UserPostsWhereInput')
  })

  it('orderByInput produces correct name', () => {
    expect(defaultArgsNamingStrategy.orderByInput('user', 'posts')).toBe('UserPostsOrderByInput')
  })

  it('relationFilterInput produces correct name', () => {
    expect(defaultArgsNamingStrategy.relationFilterInput('user', 'posts')).toBe('UserPostsFilter')
  })

  it('upper-cases first letter of both type and field names', () => {
    expect(defaultArgsNamingStrategy.whereInput('post', 'author')).toBe('PostAuthorWhereInput')
  })
})

describe('defaultFieldNamingStrategy', () => {
  it('findUnique returns camelCased model name', () => {
    expect(defaultFieldNamingStrategy.findUnique('findUniqueUser', 'User')).toBe('user')
  })

  it('findUnique handles multi-word model name', () => {
    expect(defaultFieldNamingStrategy.findUnique('findUniqueBlogPost', 'BlogPost')).toBe('blogPost')
  })

  it('findMany returns pluralized camelCased model name', () => {
    expect(defaultFieldNamingStrategy.findMany('findManyUser', 'User')).toBe('users')
  })

  it('findMany handles multi-word model name', () => {
    expect(defaultFieldNamingStrategy.findMany('findManyModelName', 'ModelName')).toBe('modelNames')
  })

  it('aggregate passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.aggregate('aggregateUser', 'User')).toBe('aggregateUser')
  })

  it('groupBy passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.groupBy('groupByUser', 'User')).toBe('groupByUser')
  })

  it('create passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.create('createOneUser', 'User')).toBe('createOneUser')
  })

  it('createMany passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.createMany('createManyUser', 'User')).toBe('createManyUser')
  })

  it('delete passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.delete('deleteOneUser', 'User')).toBe('deleteOneUser')
  })

  it('deleteMany passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.deleteMany('deleteManyUser', 'User')).toBe('deleteManyUser')
  })

  it('update passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.update('updateOneUser', 'User')).toBe('updateOneUser')
  })

  it('updateMany passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.updateMany('updateManyUser', 'User')).toBe('updateManyUser')
  })

  it('upsert passes through fieldName', () => {
    expect(defaultFieldNamingStrategy.upsert('upsertOneUser', 'User')).toBe('upsertOneUser')
  })
})
