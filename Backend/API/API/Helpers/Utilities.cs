using System;

namespace API.Helpers
{
    public static class Utilities
    {
        /// <returns> - globally unique identifier as string </returns>
        public static string GetGUID() => Guid.NewGuid().ToString();
    }
}
