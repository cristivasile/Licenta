using System;

namespace API.Helpers
{
    public static class Utilities
    {
        /// <returns> - globally unique identifier as string </returns>
        public static string GetGUID() => Guid.NewGuid().ToString();

        /// <summary>
        /// Receives a string and 'normalizes' it by making only the first letter uppercase
        /// ex: exAMpLe => Example
        /// </summary>
        public static string CapitalizeOnlyFirstLetter(string input)
        {
            if (input.Length == 0)
                return "";

            return char.ToLower(input[0]) + input.Substring(1).ToLower();
        }
    }
}
