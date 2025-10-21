import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@vladyslav-kolomiichuk-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
