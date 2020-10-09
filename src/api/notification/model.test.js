import { Notification } from '.'
import { User } from '../user'

let user, notification

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  notification = await Notification.create({ sender: user, _os_notification_id: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = notification.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(notification.id)
    expect(typeof view.sender).toBe('object')
    expect(view.sender.id).toBe(user.id)
    expect(view._os_notification_id).toBe(notification._os_notification_id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = notification.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(notification.id)
    expect(typeof view.sender).toBe('object')
    expect(view.sender.id).toBe(user.id)
    expect(view._os_notification_id).toBe(notification._os_notification_id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
