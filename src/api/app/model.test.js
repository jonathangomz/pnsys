import { App } from '.'

let app

beforeEach(async () => {
  app = await App.create({ provider: 'test', name: 'test', description: 'test', status: 'test', keys: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = app.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(app.id)
    expect(view.provider).toBe(app.provider)
    expect(view.name).toBe(app.name)
    expect(view.description).toBe(app.description)
    expect(view.status).toBe(app.status)
    expect(view.keys).toBe(app.keys)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = app.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(app.id)
    expect(view.provider).toBe(app.provider)
    expect(view.name).toBe(app.name)
    expect(view.description).toBe(app.description)
    expect(view.status).toBe(app.status)
    expect(view.keys).toBe(app.keys)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
