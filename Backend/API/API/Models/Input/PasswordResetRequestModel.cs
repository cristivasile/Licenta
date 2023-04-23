namespace API.Models.Input
{
    public class PasswordResetRequestModel
    {
        public string WebsiteResetPasswordLink { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
    }
}
