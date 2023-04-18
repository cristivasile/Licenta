namespace API.Models.Input
{
    public class AppointmentIntervalsRequestModel
    {
        public string LocationId { get; set; }
        public uint AppointmentDuration { get; set; }
        public int NumberOfDaysToGenerate { get; set; }
    }
}
