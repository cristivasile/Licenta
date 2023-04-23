namespace API.Models.Input
{
    public class PasswordResetModel
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public string NewPassword { get; set; }
    }
}
