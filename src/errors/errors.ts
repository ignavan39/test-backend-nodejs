export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 400;
  
  constructor(message: string = 'Validation error') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  
  constructor(message: string = 'Conflict') {
    super(message);
  }
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  
  constructor(message: string = 'Internal server error') {
    super(message);
  }
}

export class EventNotFoundError extends NotFoundError {
  constructor(eventId: number) {
    super(`Event with id ${eventId} not found`);
  }
}

export class DuplicateBookingError extends ConflictError {
  constructor(eventId: number, userId: string) {
    super(`User ${userId} already has a booking for event ${eventId}`);
  }
}

export class NoAvailableSeatsError extends ConflictError {
  constructor(eventId: number) {
    super(`No available seats for event ${eventId}`);
  }
}

export class InvalidInputError extends ValidationError {
  constructor(field: string, expectedType: string) {
    super(`Invalid ${field}, expected ${expectedType}`);
  }
}