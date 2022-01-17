using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Domain
{
    public class PalestranteEvento
    {
        public int PalestranteID { get; set; }
        public Palestrante Palestrante { get; set; }
        public int EventoId { get; set; }
        public Evento Evento { get; set; }
    }
}