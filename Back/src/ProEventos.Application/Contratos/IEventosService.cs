using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(int userId, EventoDto model);
        Task<EventoDto> UpdateEventos(int userId, int eventoId, EventoDto model);
        Task<bool> DeleteEventos(int userId, int eventoId);

        Task<EventoDto[]> GetAllEventosAsync(int userId, bool includePalestrantes = false);
        Task<EventoDto[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes = false);
    }
}