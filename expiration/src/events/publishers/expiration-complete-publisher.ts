import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@vladyslav-kolomiichuk-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
