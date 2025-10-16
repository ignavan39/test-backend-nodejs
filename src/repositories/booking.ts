import { Repository } from 'typeorm';
import { Booking } from '../entities/booking';

export class BookingRepository extends Repository<Booking> {
  
  async checkExistingBooking(eventId: number, userId: string): Promise<boolean> {
    const existingBooking = await this.findOne({
      where: { event_id: eventId, user_id: userId }
    });
    return !!existingBooking;
  }

  async createBooking(eventId: number, userId: string): Promise<Booking> {
    const booking = this.create({
      event_id: eventId,
      user_id: userId
    });
    
    return await this.save(booking);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.find({
      where: { user_id: userId },
      relations: ['event']
    });
  }

  async getEventBookings(eventId: number): Promise<Booking[]> {
    return await this.find({
      where: { event_id: eventId },
      relations: ['event']
    });
  }
}