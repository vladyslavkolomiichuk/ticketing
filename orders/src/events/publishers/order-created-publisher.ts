import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@vladyslav-kolomiichuk-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
