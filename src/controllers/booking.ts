import { Request, Response } from 'express';
import { BookingService } from '../services/booking';
import {
	AppError,
} from '../errors/errors';

export class BookingController {


	constructor(private bookingService: BookingService) { }

	reserve = async (req: Request, res: Response): Promise<void> => {
		try {
			const { event_id, user_id } = req.body;

			if (event_id === undefined || user_id === undefined) {
				res.status(400).json({
					success: false,
					error: 'event_id and user_id are required'
				});
				return;
			}

			const booking = await this.bookingService.reserveSeat(event_id, user_id);

			res.status(201).json({
				success: true,
				data: {
					booking_id: booking.id,
					event_id: booking.event_id,
					user_id: booking.user_id,
					created_at: booking.created_at
				}
			});

		} catch (error) {
			this.handleError(res, error);
		}
	};

	getAvailableSeats = async (req: Request, res: Response): Promise<void> => {
		try {
			const { event_id } = req.params;

			if (!event_id) {
				res.status(400).json({
					success: false,
					error: 'event_id is required'
				});
				return;
			}

			const availableSeats = await this.bookingService.getAvailableSeats(parseInt(event_id));

			res.status(200).json({
				success: true,
				data: {
					event_id: parseInt(event_id),
					available_seats: availableSeats
				}
			});

		} catch (error) {
			this.handleError(res, error);
		}
	};

	getUserBookings = async (req: Request, res: Response): Promise<void> => {
		try {
			const { user_id } = req.params;

			if (!user_id) {
				res.status(400).json({
					success: false,
					error: 'user_id is required'
				});
				return;
			}

			const bookings = await this.bookingService.getUserBookings(user_id);

			res.status(200).json({
				success: true,
				data: bookings.map(booking => ({
					booking_id: booking.id,
					event_id: booking.event_id,
					user_id: booking.user_id,
					created_at: booking.created_at,
					event_name: booking.event?.name
				}))
			});

		} catch (error) {
			this.handleError(res, error);
		}
	};

	private handleError(res: Response, error: unknown): void {
		console.error('Controller error:', error);

		if (error instanceof AppError) {
			res.status(error.statusCode).json({
				success: false,
				error: error.message
			});
		} else {
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}
}