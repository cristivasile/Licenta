namespace API.Models.Return
{
    public class LoginReturnModel
    {
        public string AccessToken { get; set; }
        public string Role { get; set; }
        public bool HasRecommendations { get; set; }
    }
}
