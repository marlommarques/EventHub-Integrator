/**
 * Tipo que representa a estrutura dos dados recebidos nos eventos.
 *
 * Deve ser expandido conforme as necessidades do domínio.
 */
type PayloadType = {};

/**
 * Service responsável por consumir e processar eventos do EventBus.
 *
 * RESPONSABILIDADES:
 * - Implementar a lógica de negócio para cada tipo de evento
 * - Executar side effects (chamadas a APIs, atualizações de cache, logs, etc.)
 * - Coordenar operações com outros services/repositories
 *
 * PADRÃO DE DESIGN:
 * - Service Layer Pattern: isola a lógica de negócio
 * - Cada método é async para suportar operações assíncronas
 * - Métodos nomeados consistentemente: handler + TipoEvento
 */
class ConsumerService {
  /**
   * Processa eventos de criação de entidades.
   *
   * @param payload - Dados da entidade que foi criada
   * @returns Promise que resolve quando o processamento é concluído
   *
   * CASOS DE USO TÍPICOS:
   * - Enviar notificações (email, push, webhook)
   * - Atualizar índices de busca (Elasticsearch, Algolia)
   * - Atualizar caches (Redis)
   * - Criar registros de auditoria
   * - Disparar workflows subsequentes
   * - Sincronizar com sistemas externos
   */
  async handlerCreated(payload: PayloadType) {
    console.log("Evento de criação disparado");

    return Promise.resolve();
  }

  /**
   * Processa eventos de alteração de entidades.
   *
   * @param payload - Dados da entidade que foi modificada
   * @returns Promise que resolve quando o processamento é concluído
   *
   * CASOS DE USO TÍPICOS:
   * - Comparar estado anterior vs atual
   * - Notificar usuários afetados pela mudança
   * - Atualizar dependências (ex: recalcular totais)
   * - Invalidar caches relacionados
   * - Manter histórico de versões
   * - Sincronizar alterações com réplicas
   */
  async handlerChanged(payload: PayloadType) {
    console.log("Evento alteração disparado");

    return Promise.resolve();
  }

  /**
   * Processa eventos de exclusão de entidades.
   *
   * @param payload - Dados da entidade que foi excluída
   * @returns Promise que resolve quando o processamento é concluído
   *
   * CASOS DE USO TÍPICOS:
   * - Executar soft delete (marcar como deletado sem remover)
   * - Limpar dados relacionados (cascade delete lógico)
   * - Mover para lixeira/arquivo morto
   * - Notificar sistemas dependentes
   * - Criar backup antes da exclusão permanente
   * - Liberar recursos associados (storage, licenças)
   */
  async handlerExcluded(payload: PayloadType) {
    console.log("Evento exclusão disparado");

    return Promise.resolve();
  }
}

/**
 * Instância singleton do ConsumerService exportada para uso em toda a aplicação.
 *
 * PADRÃO SINGLETON:
 * - Garante uma única instância do service
 * - Facilita injeção de dependências
 * - Simplifica testes (pode ser mockado facilmente)
 */
export const consumerService = new ConsumerService();
