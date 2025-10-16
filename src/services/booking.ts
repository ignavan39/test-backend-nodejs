
import { Booking } from '../entities/booking';
import {
	EventNotFoundError,
	DuplicateBookingError,
	NoAvailableSeatsError,
	InvalidInputError
} from '../errors/errors';
import { BookingRepository } from '../repositories/booking';
import { EventRepository } from '../repositories/events';

export class BookingService {


	constructor(private bookingRepository: BookingRepository, private eventRepository: EventRepository,) {
	}

	async reserveSeat(eventId: number, userId: string): Promise<Booking> {
		if (!eventId || eventId <= 0) {
			throw new InvalidInputError('event_id', 'positive number');
		}

		if (!userId || typeof userId !== 'string') {
			throw new InvalidInputError('user_id', 'non-empty string');
		}

		const eventExists = await this.eventRepository.isEventExists(eventId);
		if (!eventExists) {
			throw new EventNotFoundError(eventId);
		}

		const existingBooking = await this.bookingRepository.checkExistingBooking(eventId, userId);
		if (existingBooking) {
			throw new DuplicateBookingError(eventId, userId);
		}

		const availableSeats = await this.eventRepository.getAvailableSeats(eventId);
		if (availableSeats <= 0) {
			throw new NoAvailableSeatsError(eventId);
		}

		return await this.bookingRepository.createBooking(eventId, userId);
	}

	async getAvailableSeats(eventId: number): Promise<number> {
		if (!eventId || eventId <= 0) {
			throw new InvalidInputError('event_id', 'positive number');
		}

		return await this.eventRepository.getAvailableSeats(eventId);
	}

	async getUserBookings(userId: string): Promise<Booking[]> {
		if (!userId || typeof userId !== 'string') {
			throw new InvalidInputError('user_id', 'non-empty string');
		}

		return await this.bookingRepository.getUserBookings(userId);
	}

	async getEventBookings(eventId: number): Promise<Booking[]> {
		if (!eventId || eventId <= 0) {
			throw new InvalidInputError('event_id', 'positive number');
		}

		return await this.bookingRepository.getEventBookings(eventId);
	}
}