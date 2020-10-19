import { Notification } from '.'

let notification

beforeEach(async () => {
  notification = await Notification.create({ message: 'test', options: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = notification.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(notification.id)
    expect(view.message).toBe(notification.message)
    expect(view.options).toBe(notification.options)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = notification.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(notification.id)
    expect(view.message).toBe(notification.message)
    expect(view.options).toBe(notification.options)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
