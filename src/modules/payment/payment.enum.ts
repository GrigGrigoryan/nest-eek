export enum PaymentResponseCode {
  APPROVED = '00',
  ORDER_EXIST = '01',
  ORDER_DECLINE = '02',
  INCORRECT_CURRENCY = '03',
  MISSING_PARAMETER = '04',
  UNREGISTERED_ORDER_ID = '06',
  SYSTEM_ERROR = '07',
}

// handle 116 anbavarar mijoc client based

export enum PaymentOrderStatus {
  PAYMENT_STARTED = '0',
  PAYMENT_APPROVED = '1',
  PAYMENT_DEPOSITED = '2',
  PAYMENT_VOID = '3',
  PAYMENT_REFUNDED = '4',
  PAYMENT_AUTOAUTHORIZED = '5',
  PAYMENT_DECLINED = '6',
}

export enum PaymentLanguage {
  ARMENIAN = 'am',
  RUSSIAN = 'ru',
  ENGLISH = 'en',
}
