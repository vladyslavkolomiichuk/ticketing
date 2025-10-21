import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@vladyslav-kolomiichuk-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
