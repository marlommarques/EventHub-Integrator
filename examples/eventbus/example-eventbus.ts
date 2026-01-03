import { EventType, BaseEvent } from "./example-eventbus-types";

type EventHandler = (event: BaseEvent) => void | Promise<void>;

/**
 * EventBus implementa o padrão Publish-Subscribe para comunicação desacoplada
 * entre diferentes partes da aplicação através de eventos.
 */
class EventBus {
  // Mapa que armazena os handlers registrados para cada tipo de evento
  private handlers: Map<EventType, EventHandler[]> = new Map();

  /**
   * Publica um evento para todos os handlers registrados.
   * Executa os handlers de forma assíncrona e aguarda a conclusão de todos.
   *
   * @param event - O evento a ser publicado
   * @returns Promise que resolve quando todos os handlers terminarem
   */
  async publish(event: BaseEvent): Promise<void> {
    // Se não há handlers registrados para este tipo de evento, retorna imediatamente
    if (!this.handlers.has(event.type)) {
      return Promise.resolve();
    }

    // Obtém todos os handlers registrados para este tipo de evento
    const eventHandlers = this.handlers.get(event.type) || [];

    // Executa todos os handlers em paralelo e aguarda a conclusão de todos
    await Promise.all(
      eventHandlers.map((handler) =>
        // Garante que o handler seja tratado como Promise, mesmo se retornar void
        Promise.resolve(handler(event))
      )
    );
  }

  /**
   * Registra um handler para ser executado quando um evento específico for publicado.
   *
   * @param eventType - O tipo de evento que o handler deve escutar
   * @param handler - A função callback que será executada quando o evento ocorrer
   */
  subscribe(eventType: EventType, handler: EventHandler) {
    // Se ainda não existe uma lista de handlers para este tipo, cria uma nova
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    // Adiciona o handler à lista de handlers deste tipo de evento
    this.handlers.get(eventType)?.push(handler);
  }

  /**
   * Remove um handler específico de um tipo de evento.
   * Útil para evitar memory leaks quando componentes são destruídos.
   *
   * @param eventType - O tipo de evento do qual remover o handler
   * @param handler - O handler específico a ser removido
   * @returns true se o handler foi removido, false caso contrário
   */
  unsubscribe(eventType: EventType, handler: EventHandler): boolean {
    const eventHandlers = this.handlers.get(eventType);

    if (!eventHandlers) {
      return false;
    }

    const index = eventHandlers.indexOf(handler);

    if (index === -1) {
      return false;
    }

    // Remove o handler da lista
    eventHandlers.splice(index, 1);

    // Se não há mais handlers para este tipo, remove a entrada do Map
    if (eventHandlers.length === 0) {
      this.handlers.delete(eventType);
    }

    return true;
  }

  /**
   * Remove todos os handlers de um tipo de evento específico.
   *
   * @param eventType - O tipo de evento a limpar
   */
  clearEventType(eventType: EventType): void {
    this.handlers.delete(eventType);
  }

  /**
   * Remove todos os handlers de todos os tipos de eventos.
   * Útil para testes ou reset completo da aplicação.
   */
  clearAll(): void {
    this.handlers.clear();
  }

  /**
   * Retorna o número de handlers registrados para um tipo de evento.
   *
   * @param eventType - O tipo de evento a verificar
   * @returns O número de handlers registrados
   */
  getHandlerCount(eventType: EventType): number {
    return this.handlers.get(eventType)?.length || 0;
  }
}

// Instância singleton do EventBus para uso em toda a aplicação
export const eventBus = new EventBus();
