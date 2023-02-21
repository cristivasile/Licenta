using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class Utilities
    {
        /// <returns> - globally unique identifier </returns>
        public static string GetGUID() => Guid.NewGuid().ToString();
    }
}
