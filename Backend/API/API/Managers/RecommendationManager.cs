using API.Entities;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using API.Models.Return;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Managers
{
    public class RecommendationManager : IRecommendationManager
    {

        private readonly int recommendationViewLimit = 10000;    //recommendations will be made based on the last <recommendationViewLimit> views
        private readonly int personalRecommendationMultiplier = 5;      //how many times more imporant a user's view should be
        private readonly IUserDetailsRepository userDetailsRepository;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IVehicleViewRepository vehicleViewRepository;

        public RecommendationManager(IUserDetailsRepository userDetailsRepository, IVehicleRepository vehicleRepository, IVehicleViewRepository vehicleViewRepository)
        {
            this.userDetailsRepository = userDetailsRepository;
            this.vehicleRepository = vehicleRepository;
            this.vehicleViewRepository = vehicleViewRepository; 
        }

        public async Task<List<VehicleModel>> SortByRecommended(List<VehicleModel> vehiclesToSort, string userId)
        {
            var details = await userDetailsRepository.GetByUserId(userId) ?? throw new Exception("Cannot sort by recommended for a user without details!");

            var usersTask = userDetailsRepository.GetSimilarUsers(details);
            var vehiclesTask = vehicleRepository.GetAll();
            await Task.WhenAll(usersTask, vehiclesTask);

            var similarUsers = usersTask.Result;
            var vehicles = vehiclesTask.Result;

            double priceAverage = 0.0;
            double powerAverage = 0.0;
            Dictionary<string, int> bodyTypeViewDictionary = new();

            //get a list of all views
            List<VehicleView> views = new();
            foreach (var similarUser in similarUsers)
            {
                var vehicleViews = await vehicleViewRepository.GetByUserId(similarUser.UserId);

                if (similarUser.UserId != userId)
                    views.AddRange(vehicleViews);
                else
                    for(int _ = 0; _ < personalRecommendationMultiplier; _++)   //the current user's views should hold more weight
                        views.AddRange(vehicleViews);
            }

            //sort by newest and take newest <recommendationViewLimit>
            views = views.OrderByDescending(x => x.Date).Take(recommendationViewLimit).ToList();

            foreach(var view in views)
            {
                priceAverage += view.Vehicle.Price / (views.Count);
                powerAverage += view.Vehicle.Power / (views.Count);

                if (!bodyTypeViewDictionary.ContainsKey(view.Vehicle.BodyTypeName))
                    bodyTypeViewDictionary[view.Vehicle.BodyTypeName] = 1;
                else
                    bodyTypeViewDictionary[view.Vehicle.BodyTypeName] += 1;
            }

            Dictionary<string, double> vehicleDesirability = new(); 

            foreach(var vehicle in vehiclesToSort)
            {
                double desirability = 0.0;

                desirability += GetSimilarity(priceAverage, vehicle.Price);
                desirability += GetSimilarity(powerAverage, vehicle.Power);

                if (bodyTypeViewDictionary.TryGetValue(vehicle.BodyType, out int value))
                    // 2 * to assign a bigger importance to body types
                    desirability += 2 * (value / views.Count);   
            }

            vehiclesToSort = vehiclesToSort.OrderByDescending(x => vehicleDesirability[x.Id]).ToList();

            return vehiclesToSort;
        }

        private static double GetSimilarity(double x, double y)
        {
            double midpoint = (x / 2) + (x * 2);
            double distance = Math.Abs(y - midpoint) / Math.Abs(x - midpoint);

            double result = 1.0 - distance;

            return Math.Max(result, 0.0);
        }
    }
}
