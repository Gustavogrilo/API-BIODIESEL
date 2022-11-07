import { Module } from '@nestjs/common';

import { UsuarioModule } from './usuario/usuario.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { PaisModule } from './pais/pais.module';
import { EstadoModule } from './estado/estado.module';
import { MunicipioModule } from './municipio/municipio.module';
import { ClienteModule } from './cliente/cliente.module';
import { UsuarioProdutorModule } from './usuario-produtor/usuario-produtor.module';
import { UsuarioClienteModule } from './usuario-cliente/usuario-cliente.module';
import { ClientePessoaModule } from 'src/domain/cliente-pessoa/cliente-pessoa.module';
import { FilialModule } from './filial/filial.module';
import { PropriedadeModule } from './propriedade/propriedade.module';
import { DapModule } from './dap/dap.module';
import { ClientePropriedadeModule } from './cliente-propriedade/cliente-propriedade.module';
import { AnexoModule } from './anexo/anexo.module';
import { InsumoModule } from './insumo/insumo.module';
import { InsumoTipoModule } from './insumo-tipo/insumo-tipo.module';
import { SafraModule } from './safra/safra.module';
import { QueTemaModule } from './que-tema/que-tema.module';
import { QueSubtemaModule } from './que-subtema/que-subtema.module';
import { QuestionarioModule } from './questionario/questionario.module';
import { QuestionarioTemaModule } from './questionario-tema/questionario-tema.module';
import { QueTemaSubtemaModule } from './que-tema-subtema/que-tema-subtema.module';
import { QueItemListaModule } from './que-item-lista/que-item-lista.module';
import { QuePerguntaItemListaModule } from './que-pergunta-item-lista/que-pergunta-item-lista.module';
import { QuePerguntaModule } from './que-pergunta/que-pergunta.module';
import { QueSubtemaPerguntaModule } from './que-subtema-pergunta/que-subtema-pergunta.module';
import { QueListaModule } from './que-lista/que-lista.module';
import { QueDiagnosticoModule } from './que-diagnostico/que-diagnostico.module';
import { QueRespostaModule } from './que-resposta/que-resposta.module';
import { QueListaItemListaModule } from './que-lista-item-lista/que-lista-item-lista.module';
import { QuePerguntaVariavelModule } from './que-pergunta-variavel/que-pergunta-variavel.module';
import { QueRespostaAnexoModule } from './que-resposta-anexo/que-resposta-anexo.module';
import { CroquiPropriedadeModule } from './croqui-propriedade/croqui-propriedade.module';
import { CroquiCoordenadaModule } from './croqui-coordenada/croqui-coordenada.module';
import { QueRespostaInsumoModule } from './que-resposta-insumo/que-resposta-insumo.module';
import { ContadoresHomeModule } from './contadores-home/contadores-home.module';
import { PerfilModule } from './perfil/perfil.module';
import { PerfilItemModule } from './perfil-item/perfil-item.module';
import { PerfilRespostaModule } from './perfil-resposta/perfil-resposta.module';
import { PerfilSubtemaModule } from './perfil-subtema/perfil-subtema.module';
import { PerfilTemaModule } from './perfil-tema/perfil-tema.module';
import { DispositivoModule } from './dispositivo/dispositivo.module';
import { AtendimentoModule } from './atendimento/atendimento.module';

@Module({
  imports: [
    UsuarioModule,
    PessoaModule,
    PaisModule,
    EstadoModule,
    MunicipioModule,
    ClienteModule,
    UsuarioProdutorModule,
    UsuarioClienteModule,
    ClientePessoaModule,
    FilialModule,
    PropriedadeModule,
    DapModule,
    ClientePropriedadeModule,
    AnexoModule,
    InsumoModule,
    InsumoTipoModule,
    SafraModule,
    QueTemaModule,
    QueSubtemaModule,
    QuestionarioModule,
    QuestionarioTemaModule,
    QueTemaSubtemaModule,
    QueItemListaModule,
    QuePerguntaItemListaModule,
    QuePerguntaModule,
    QueSubtemaPerguntaModule,
    QueListaModule,
    QueDiagnosticoModule,
    QueRespostaModule,
    QueListaItemListaModule,
    QuePerguntaVariavelModule,
    QueRespostaAnexoModule,
    CroquiPropriedadeModule,
    CroquiCoordenadaModule,
    QueRespostaInsumoModule,
    ContadoresHomeModule,
    PerfilModule,
    PerfilItemModule,
    PerfilRespostaModule,
    PerfilSubtemaModule,
    PerfilTemaModule,
    DispositivoModule,
    AtendimentoModule,
  ],
})
export class DomainModule {}
