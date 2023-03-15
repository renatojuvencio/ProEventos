using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class PalestranteEventoDto
    {
       public int PalestranteID { get; set; }
        public PalestranteDto Palestrante { get; set; }
        public int EventoId { get; set; }
        public EventoDto Evento { get; set; }
    
    }
}