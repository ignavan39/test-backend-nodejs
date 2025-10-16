import 'reflect-metadata';
import express from 'express';
import { Container } from './container';
import { errorHandler } from './middleware/error-handler';

class App {
  public app: express.Application;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = Container.getInstance();
    
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const dataSource = this.container.getDataSource();
      await dataSource.initialize();
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const bookingController = this.container.getBookingController();
    
    const router = express.Router();
    
    router.post('/bookings/reserve', bookingController.reserve);
    
    router.get('/events/:event_id/available-seats', bookingController.getAvailableSeats);
    router.get('/users/:user_id/bookings', bookingController.getUserBookings);
    
    this.app.use('/api', router);
    
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: this.container.getDataSource().isInitialized ? 'connected' : 'disconnected'
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
    
    this.app.use(/(.*)/, (_req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

const app = new App();
app.listen(parseInt(process.env.PORT || '3000'));

export default app;