export enum NotificationAction {
  RESET_PASSWORD = 'resetPassword',
  REGISTER_SUCCESS = 'registerSuccess',
  REGISTER_CONFIRM = 'registerConfirm',
  BLOCK_USER = 'blockUser',
  UNBLOCK_USER = 'unblockUser',
  ORDER_CANCELLATION = 'orderCancellation',
  ORDER_CONFIRMATION = 'orderConfirmation',
}

export enum NotificationType {
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
}
