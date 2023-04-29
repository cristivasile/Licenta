namespace API.Models.Input
{
    public class UserCreateModel
    {
        public string WebsiteConfirmationPageLink { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

#nullable enable
        public UserDetailsCreateModel? UserDetails { get; set; }
    }
}
