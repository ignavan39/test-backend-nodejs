import { DataSource } from 'typeorm';
import { BookingController } from './controllers/booking';
import { BookingService } from './services/booking';
import { BookingRepository } from './repositories/booking';
import { EventRepository } from './repositories/events';
import { AppDataSource } from './data-source';
import { Booking } from './entities/booking';

export class Container {
	private static instance: Container;
	private dataSource: DataSource;
	private bookingRepository: BookingRepository;
	private eventRepository: EventRepository;
	private bookingService: BookingService;
	private bookingController: BookingController;

	private constructor() {
		this.dataSource = AppDataSource;
		this.initializeRepositories();
		this.initializeServices();
		this.initializeControllers();
	}

	public static getInstance(): Container {
		if (!Container.instance) {
			Container.instance = new Container();
		}
		return Container.instance;
	}

	private initializeRepositories(): void {
		this.bookingRepository = new BookingRepository(Booking, this.dataSource.manager);
		this.eventRepository = new EventRepository(Event, this.dataSource.manager);
	}

	private initializeServices(): void {
		this.bookingService = new BookingService(
			this.bookingRepository,
			this.eventRepository
		);
	}

	private initializeControllers(): void {
		this.bookingController = new BookingController(this.bookingService);
	}

	public getDataSource(): DataSource {
		return this.dataSource;
	}

	public getBookingController(): BookingController {
		return this.bookingController;
	}

	public getBookingService(): BookingService {
		return this.bookingService;
	}

	public getBookingRepository(): BookingRepository {
		return this.bookingRepository;
	}

	public getEventRepository(): EventRepository {
		return this.eventRepository;
	}
}