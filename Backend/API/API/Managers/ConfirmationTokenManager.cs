using API.Entities;
using API.Interfaces.Managers;
using API.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Managers
{
    public class ConfirmationTokenManager : IConfirmationTokenManager
    {

        private readonly IConfirmationTokenRepository confirmationTokenRepository;

        public ConfirmationTokenManager(IConfirmationTokenRepository confirmationTokenRepository) 
        {
            this.confirmationTokenRepository = confirmationTokenRepository;
        }

        public async Task<ConfirmationToken> Create(string userId, ConfirmationTokenTypeEnum type)
        {
            ConfirmationToken newToken = new() 
            { 
              UserId = userId, 
              Type = type,
              CreationTime = DateTime.Now,
              Token = Program.GetGUID()
            };

            await confirmationTokenRepository.Create(newToken);

            return newToken;
        }

        public async Task Delete(string token)
        {
            var foundToken = await confirmationTokenRepository.GetByToken(token) ?? throw new KeyNotFoundException(token);
            await confirmationTokenRepository.Delete(foundToken);
        }

        public async Task<ConfirmationToken> GetByToken(string token)
            => await confirmationTokenRepository.GetByToken(token);

        public async Task<List<ConfirmationToken>> GetByUserId(string userId)
           => await confirmationTokenRepository.GetByUserId(userId);
        
    }
}
