import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'feda49f1-413b-4a40-b5b8-ae9ba0247128',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      'feda49f1-413b-4a40-b5b8-ae9ba0247128',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date(2020, 5, 10, 11); // 10/06/2020 11:00:00

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
