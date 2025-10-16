import { EntityRepository, Repository } from 'typeorm';
import { Event } from '../entities/event';
import { EventNotFoundError } from '../errors/errors';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  
  async getEventWithBookings(eventId: number): Promise<Event> {
    const event = await this.findOne({
      where: { id: eventId },
      relations: ['bookings']
    });

    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    return event;
  }

  async getAvailableSeats(eventId: number): Promise<number> {
    const event = await this.getEventWithBookings(eventId);
    const bookedSeats = event.bookings?.length || 0;
    return event.total_seats - bookedSeats;
  }

  async isEventExists(eventId: number): Promise<boolean> {
    const event = await this.findOne({where: {id: eventId}});
    return !!event;
  }
}