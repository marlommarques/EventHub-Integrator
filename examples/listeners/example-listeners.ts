import {
  EventTypes,
  type Listener,
  type BaseEvent,
} from "../eventbus/example-eventbus-types";
import { consumerService } from "../modules/example-consumer";

/**
 * Array de listeners
 *
 * Este arquivo centraliza todos os event handlers que o orquestrador
 * precisa registrar no EventBus. É um padrão útil para:
 *
 * - Organização: todos os listeners em um único lugar
 * - Manutenibilidade: fácil visualizar quais eventos estão sendo escutados
 * - Reutilização: pode ser importado e registrado em massa no EventBus
 * - Testabilidade: pode ser facilmente mockado em testes
 */
export const exampleListeners: Listener[] = [
  {
    // Listener para eventos de criação de entidades
    event: EventTypes.CREATED,

    /**
     * Handler executado quando uma entidade é criada.
     *
     * @param event - O evento contendo os dados da entidade criada
     *
     * Fluxo:
     * 1. Extrai o payload do evento
     * 2. Delega o processamento ao consumerService
     * 3. Aguarda a conclusão do processamento (async/await)
     */
    handler: async (event: BaseEvent) => {
      const payload = event.payload;

      // Delega a lógica de negócio específica para o service apropriado
      await consumerService.handlerCreated(payload);
    },
  },
  {
    // Listener para eventos de alteração de entidades
    event: EventTypes.CHANGED,

    /**
     * Handler executado quando uma entidade é modificada.
     *
     * @param event - O evento contendo os dados da entidade alterada
     *
     * Idealmente o payload deveria conter:
     * - Estado anterior (before)
     * - Estado atual (after)
     * - Campos que foram modificados (changes)
     */
    handler: async (event: BaseEvent) => {
      const payload = event.payload;

      // Processa a alteração da entidade
      await consumerService.handlerChanged(payload);
    },
  },

  {
    // Listener para eventos de exclusão de entidades
    event: EventTypes.EXCLUDED,

    /**
     * Handler executado quando uma entidade é excluída.
     *
     * @param event - O evento contendo informações da entidade excluída
     *
     * Normalmente o payload contém:
     * - ID da entidade excluída
     * - Snapshot dos dados antes da exclusão (para auditoria/restore)
     * - Metadados sobre quem/quando excluiu
     */
    handler: async (event: BaseEvent) => {
      const payload = event.payload;

      // Processa a exclusão (pode envolver cleanup, notificações, etc.)
      await consumerService.handlerExcluded(payload);
    },
  },
];
