import { DataSource } from 'typeorm';
import { Booking } from '../entities/booking';
import { Event } from '../entities/event';
import { 
  EventNotFoundError, 
  DuplicateBookingError, 
  NoAvailableSeatsError,
  InvalidInputError 
} from '../errors/errors';

export class BookingService {
  constructor(private dataSource: DataSource) {}

  async reserveSeat(eventId: number, userId: string): Promise<Booking> {
    this.validateInput(eventId, userId);

    const eventRepository = this.dataSource.getRepository(Event);
    const bookingRepository = this.dataSource.getRepository(Booking);

    const event = await eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    const existingBooking = await bookingRepository.findOne({
      where: { event_id: eventId, user_id: userId }
    });
    if (existingBooking) {
      throw new DuplicateBookingError(eventId, userId);
    }

    const bookedCount = await bookingRepository.count({
      where: { event_id: eventId }
    });
    
    if (bookedCount >= event.total_seats) {
      throw new NoAvailableSeatsError(eventId);
    }

    const booking = bookingRepository.create({
      event_id: eventId,
      user_id: userId
    });
    
    return await bookingRepository.save(booking);
  }

  async getAvailableSeats(eventId: number): Promise<number> {
    this.validateEventId(eventId);

    const eventRepository = this.dataSource.getRepository(Event);
    const bookingRepository = this.dataSource.getRepository(Booking);

    const event = await eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    const bookedCount = await bookingRepository.count({
      where: { event_id: eventId }
    });

    return event.total_seats - bookedCount;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    this.validateUserId(userId);

    const bookingRepository = this.dataSource.getRepository(Booking);
    
    return await bookingRepository.find({
      where: { user_id: userId },
      relations: ['event']
    });
  }

  async getEventBookings(eventId: number): Promise<Booking[]> {
    this.validateEventId(eventId);

    const bookingRepository = this.dataSource.getRepository(Booking);
    
    return await bookingRepository.find({
      where: { event_id: eventId },
      relations: ['event']
    });
  }

  private validateInput(eventId: number, userId: string): void {
    this.validateEventId(eventId);
    this.validateUserId(userId);
  }

  private validateEventId(eventId: number): void {
    if (!eventId || eventId <= 0) {
      throw new InvalidInputError('event_id', 'positive number');
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new InvalidInputError('user_id', 'non-empty string');
    }
  }
}