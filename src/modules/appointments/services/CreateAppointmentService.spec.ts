import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'feda49f1-413b-4a40-b5b8-ae9ba0247128',
      user_id: '9af66648-cff7-48fb-a84a-a41c9a4b7d09',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      'feda49f1-413b-4a40-b5b8-ae9ba0247128',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 8).getTime();
    });

    const appointmentDate = new Date(2020, 5, 10, 11); // 10/06/2020 11:00:00

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
      user_id: '9af66648-cff7-48fb-a84a-a41c9a4b7d09',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
        user_id: '9af66648-cff7-48fb-a84a-a41c9a4b7d09',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 10),
        provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
        user_id: '9af66648-cff7-48fb-a84a-a41c9a4b7d09',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
        user_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'feda49f1-413b-4a40-b5b8-ae9ba0247128',
        user_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'feda49f1-413b-4a40-b5b8-ae9ba0247128',
        user_id: '05024d2f-5d17-4e0c-8c51-c9755eddfe28',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
