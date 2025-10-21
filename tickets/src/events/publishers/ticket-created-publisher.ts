import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@vladyslav-kolomiichuk-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
