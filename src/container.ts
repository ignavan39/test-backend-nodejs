import { DataSource } from 'typeorm';
import { BookingController } from './controllers/booking';
import { BookingService } from './services/booking';
import { AppDataSource } from './data-source';

export class Container {
	private static instance: Container;
	private dataSource: DataSource;
	private bookingService: BookingService;
	private bookingController: BookingController;

	private constructor() {
		this.dataSource = AppDataSource;
		this.initializeServices();
		this.initializeControllers();
	}

	public static getInstance(): Container {
		if (!Container.instance) {
			Container.instance = new Container();
		}
		return Container.instance;
	}


	private initializeServices(): void {
		this.bookingService = new BookingService(this.dataSource)
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
}