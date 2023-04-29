using API.Entities;
using API.Helpers;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Input;
using API.Models.Return;
using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class AppointmentManager : IAppointmentManager
    {
        private readonly IAppointmentRepository appointmentRepository;
        private readonly IAppointmentTypeRepository appointmentTypeRepository;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IScheduleRepository scheduleRepository;
        private readonly UserManager<User> userManager;
        private readonly static int upcomingAppointmentLimit = 3;
        private readonly static int daysLimit = 60;
        private readonly static int minimumAppointmentDuration = 5;
        private readonly static int intervalSize = 15;

        public AppointmentManager(IAppointmentRepository appointmentRepository, IAppointmentTypeRepository appointmentTypeRepository,
            IVehicleRepository vehicleRepository, IScheduleRepository scheduleRepository, UserManager<User> userManager)
        {
            this.appointmentRepository= appointmentRepository;
            this.appointmentTypeRepository = appointmentTypeRepository;
            this.vehicleRepository = vehicleRepository;
            this.scheduleRepository = scheduleRepository;
            this.userManager = userManager;
        }

        public async Task Create(AppointmentCreateModel newAppointment, string username)
        {
            var user = await userManager.FindByNameAsync(username);
            var vehicle = await vehicleRepository.GetById(newAppointment.VehicleId);

            if (user == null)
                throw new Exception("User does not exist!");

            if (await appointmentTypeRepository.GetById(newAppointment.AppointmentTypeId) == null)
                throw new Exception("Appointment type does not exist!");

            if (vehicle == null)
                throw new Exception("Vehicle does not exist!");

            if (vehicle.Status.IsSold)
                throw new Exception("Vehicle has already been sold!");

            if ((await appointmentRepository.GetByUserId(user.Id, upcoming: true)).Count == upcomingAppointmentLimit)
                throw new Exception($"Appointment limit of {upcomingAppointmentLimit} reached!");

            if (await appointmentRepository.GetByUserIdAndVehicleId(user.Id, newAppointment.VehicleId, upcoming: true) != null)
                throw new Exception("User already has an appointment for this vehicle!");

            var appointment = new Appointment()
            {
                Id = Utilities.GetGUID(),
                Date = newAppointment.Date.ToLocalTime(),
                FirstName = newAppointment.FirstName,
                LastName = newAppointment.LastName,
                Phone = newAppointment.Phone,
                UserId = user.Id,
                VehicleId = newAppointment.VehicleId,
                AppointmentTypeId = newAppointment.AppointmentTypeId
            };

            await appointmentRepository.Create(appointment);
        }

        public async Task Delete(string appointmentId)
        {
            var appointment = await appointmentRepository.GetById(appointmentId) ?? throw new KeyNotFoundException();

            await appointmentRepository.Delete(appointment);
        }

        public async Task<List<AppointmentModel>> GetAllByLocationId(string locationId, bool upcoming = true)
        {
            var appointmentList = await appointmentRepository.GetByLocationId(locationId, upcoming);

            return appointmentList.Select(x => new AppointmentModel(x)).OrderBy(x => x.Date).ToList();
        }

        public async Task<List<AppointmentModel>> GetAllByUsername(string username, bool upcoming = true)
        {
            var user = await userManager.FindByNameAsync(username);

            if (user == null)
                throw new Exception("User does not exist!");

            var appointmentList = await appointmentRepository.GetByUserId(user.Id, upcoming);

            return appointmentList.Select(x => new AppointmentModel(x)).OrderBy(x => x.Date).ToList();
        }

        public async Task<AppointmentModel> GetByUserAndVehicleId(AppointmentUserRequestModel request, bool upcoming = true)
        {
            var user = await userManager.FindByNameAsync(request.Username);

            if (user == null)
                throw new Exception("User does not exist!");

            var appointment = await appointmentRepository.GetByUserIdAndVehicleId(user.Id, request.VehicleId, upcoming);

            if (appointment == null)
                throw new KeyNotFoundException();

            return new AppointmentModel(appointment);
        }

        public async Task<Dictionary<string, List<DateTime>>> GetAvailableAppointmentTimes(AppointmentIntervalsRequestModel request)
        {
            if (request.NumberOfDaysToGenerate > daysLimit)
                throw new Exception($"Cannot generate intervals for more than {daysLimit} days");

            if (request.AppointmentDuration < minimumAppointmentDuration)
                throw new Exception($"The minimum appointment duration is {minimumAppointmentDuration}");

            var result = new Dictionary<DateTime, List<DateTime>>();

            var currentDay = DateTime.Now.AddDays(1).Date;

            for (int index = 0; index < request.NumberOfDaysToGenerate; index++)
            {
                var validTimesForToday = new List<DateTime>();

                //cast weekday to WeekdayEnum
                int dayOfWeek = ((int)currentDay.DayOfWeek + 6) % 7;  //internal DayOfWeek enum starts the week with Sunday
                var weekday = (WeekdayEnum)dayOfWeek;

                //get the schedule for the day of week
                var schedules = await scheduleRepository.GetByLocationId(request.LocationId);
                var schedule = await scheduleRepository.GetByLocationIdAndWeekday(request.LocationId, weekday);
                if (schedule == null)
                {
                    currentDay = currentDay.AddDays(1);
                    continue;
                }

                var appointmentsToday = await appointmentRepository.GetByLocationIdAndDate(request.LocationId, currentDay);

                var startTime = currentDay.Date.Add(schedule.OpeningTime);
                var endTime = currentDay.Date.Add(schedule.ClosingTime);

                var currentTime = startTime;
                while (currentTime.AddMinutes(request.AppointmentDuration) < endTime)
                {
                    var currentEndTime = currentTime.AddMinutes(request.AppointmentDuration);
                    bool isValid = true;

                    foreach(var appointment in appointmentsToday)
                        if (appointment.Date < currentEndTime && appointment.Date.AddMinutes(appointment.AppointmentType.Duration) > currentTime)
                        {
                            isValid = false;
                            break;
                        }

                    if (isValid)
                    {
                        validTimesForToday.Add(currentTime);
                    }

                    currentTime = currentTime.AddMinutes(intervalSize);
                }

                if (validTimesForToday.Count > 0)
                    result[currentDay] = validTimesForToday;

                currentDay = currentDay.AddDays(1);
            }

            var mappedResult = new Dictionary<string, List<DateTime>>();

            foreach (var pair in result)
            {
                // Extract only the date part of the DateTime key
                string dateString = pair.Key.Date.ToString("yyyy-MM-dd");

                // Add the values to the new dictionary
                mappedResult[dateString] = pair.Value;
            }

            return mappedResult;
        }
    }
}
