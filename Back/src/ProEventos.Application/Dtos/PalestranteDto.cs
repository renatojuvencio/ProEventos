using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string MiniCurriculo { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociaisD { get; set; }
        public IEnumerable<PalestranteEventoDto> PalestrantesEventos { get; set; }
    }
}