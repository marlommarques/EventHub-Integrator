import { exampleListeners } from "../listeners/example-listeners";
import { eventBus } from "./example-eventbus";

/**
 * Registra todos os event listeners da aplicação no EventBus.
 *
 * RESPONSABILIDADES:
 * - Centralizar o registro de todos os listeners em um único ponto
 * - Consolidar listeners de diferentes módulos/features
 * - Fornecer feedback sobre o sucesso/falha do registro
 * - Garantir que a aplicação está pronta para processar eventos
 *
 * QUANDO CHAMAR:
 * Deve ser executada durante a inicialização da aplicação, antes de
 * qualquer evento ser publicado. Típico em:
 * - Startup do servidor (Express, Fastify, etc.)
 * - Bootstrap de aplicação (NestJS, Next.js)
 * - Inicialização de workers/jobs
 *
 * @returns Promise que resolve quando todos os listeners estão registrados
 * @throws Error se houver falha no registro (para impedir inicialização parcial)
 */
export async function registerAllListeners(): Promise<void> {
  /**
   * Consolida todos os listeners de diferentes módulos em um único array.
   *
   * PADRÃO DE ESCALABILIDADE:
   * Usar spread operator permite facilmente adicionar listeners de múltiplos módulos:
   * ```typescript
   * const allListeners = [
   *   ...exampleListeners,
   *   ...userListeners,
   *   ...orderListeners,
   *   ...notificationListeners
   * ];
   * ```
   *
   * BENEFÍCIOS:
   * - Único ponto de registro
   * - Fácil adicionar/remover módulos
   * - Evita duplicação de código
   * - Visibilidade total dos listeners ativos
   */
  const allListeners = [...exampleListeners];

  try {
    /**
     * Registra todos os listeners em paralelo usando Promise.all.
     *
     * NOTA IMPORTANTE SOBRE O CÓDIGO ATUAL:
     * O método eventBus.subscribe() é síncrono e não retorna uma Promise.
     * Usar Promise.all aqui não tem efeito prático, mas também não causa problemas.
     *
     * CÓDIGO ATUAL (funciona, mas Promise.all é redundante):
     * ```typescript
     * await Promise.all(
     *   allListeners.map(({ event, handler }) =>
     *     eventBus.subscribe(event, handler)
     *   )
     * );
     * ```
     *
     * ALTERNATIVA MAIS SIMPLES (mesmo resultado):
     * ```typescript
     * allListeners.forEach(({ event, handler }) => {
     *   eventBus.subscribe(event, handler);
     * });
     * ```
     *
     * QUANDO Promise.all SERIA ÚTIL:
     * Se subscribe() fosse async (ex: validando listeners remotamente):
     * ```typescript
     * async subscribe(event, handler) {
     *   await this.validateHandler(handler);
     *   this.handlers.get(event).push(handler);
     * }
     * ```
     *
     * DESESTRUTURAÇÃO:
     * { event, handler } extrai as propriedades do objeto Listener:
     * - event: EventType - tipo do evento
     * - handler: EventHandler - função a ser executada
     */
    await Promise.all(
      allListeners.map(({ event, handler }) =>
        eventBus.subscribe(event, handler)
      )
    );

    /**
     * Log de sucesso para monitoramento e debugging.
     *
     * MELHORIAS SUGERIDAS:
     * - Usar logger estruturado (Winston, Pino) ao invés de console.log
     * - Incluir detalhes dos listeners registrados em ambiente de desenvolvimento
     */
    console.log(
      `[EventRegistry] ${allListeners.length} listeners registrados com sucesso`
    );
  } catch (error) {
    /**
     * Tratamento de erro crítico.
     *
     * ESTRATÉGIA:
     * - Loga o erro para debugging
     * - Re-lança o erro para impedir que a aplicação inicie parcialmente
     *
     * FILOSOFIA "Fail Fast":
     * É melhor a aplicação não iniciar do que iniciar com listeners faltando,
     * pois isso causaria comportamento inconsistente e difícil de debugar.
     *
     * CENÁRIOS DE ERRO POSSÍVEIS:
     * - EventBus não inicializado corretamente
     * - Handler inválido ou mal formatado
     * - Memória insuficiente
     * - Conflito de listeners (se implementar validação)
     */
    console.error("[EventRegistry] Erro ao registrar listeners:", error);
    throw error; // Re-lança para impedir inicialização incompleta
  }
}
