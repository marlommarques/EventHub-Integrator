import express from "express";
import { eventBus } from "../eventbus/example-eventbus";
import { EventType } from "../eventbus/example-eventbus-types";
import { registerAllListeners } from "../eventbus/example-event-registry";

async function bootstrap() {
  /**
   * Instância do Express para receber webhooks externos.
   *
   * Este servidor atua como um ADAPTER/GATEWAY entre sistemas externos
   * e a arquitetura event-driven interna da aplicação.
   */
  const app = express();

  /**
   * Middleware para parsear requisições JSON.
   */
  app.use(express.json());

  /**
   * Endpoint genérico para receber webhooks de sistemas externos.
   *
   * ROTA DINÂMICA:
   * - :event_type é um parâmetro de rota que identifica o tipo de evento
   * - Exemplos: /webhook/contract_created, /webhook/contract_updated
   *
   * FLUXO:
   * 1. Sistema externo envia POST com dados do evento
   * 2. API traduz o evento externo para evento interno
   * 3. Publica no EventBus para processamento assíncrono
   * 4. Retorna 202 Accepted imediatamente (fire-and-forget)
   *
   * STATUS 202 ACCEPTED:
   * Indica que a requisição foi aceita para processamento, mas ainda
   * não foi completada. Ideal para webhooks pois:
   * - Não bloqueia o sistema externo
   * - Permite processamento assíncrono
   * - Evita timeouts em operações longas
   *
   * @param req.params.event_type - Tipo do evento externo (snake_case)
   * @param req.body - Payload do evento
   */
  app.post("/webhook/:event_type", async (req, res) => {
    const { event_type } = req.params;
    const payload = req.body;

    // Processa o evento de forma assíncrona
    await handleEvent(event_type, payload);

    /**
     * Retorna 202 Accepted imediatamente.
     *
     * NOTA: O 'await' acima significa que estamos esperando o evento
     * ser publicado no EventBus antes de responder. Isso garante que
     * o evento foi aceito, mas não que foi processado completamente.
     */
    res.status(202).send();
  });

  /**
   * Traduz eventos externos (formato do webhook) para eventos internos (EventBus).
   *
   * RESPONSABILIDADES:
   * - Mapear nomenclatura externa (snake_case) para interna (UPPERCASE)
   * - Validar tipo de evento conhecido
   * - Transformar payload se necessário
   * - Logar eventos desconhecidos
   *
   * PADRÃO ANTI-CORRUPTION LAYER:
   * Esta função atua como uma camada de anti-corrupção, isolando
   * o domínio interno de mudanças nos sistemas externos.
   *
   * BENEFÍCIOS:
   * Se o webhook mudar formato, apenas esta função precisa mudar
   * EventBus não conhece sistemas externos
   * Fácil adicionar transformações ou validações
   *
   * @param type - Tipo do evento no formato externo (snake_case)
   * @param payload - Dados do evento (estrutura definida pelo sistema externo)
   */
  async function handleEvent(type: string, payload: any) {
    /**
     * Switch statement para mapear eventos externos → internos.
     */
    switch (type) {
      case "contract_created":
        return publish("CREATED", payload);
      case "contract_updated":
        return publish("CHANGED", payload);
      case "contract_deleted":
        return publish("EXCLUDED", payload);
      default:
        /**
         * Log de eventos desconhecidos para monitoramento.
         *
         * IMPORTANTE: Não lança erro para evitar falha na resposta do webhook.
         * O sistema externo não deve receber 500 por enviar um evento novo/desconhecido.
         *
         * ESTRATÉGIAS ALTERNATIVAS:
         * - Publicar evento de "evento desconhecido" para análise
         * - Armazenar em dead letter queue para investigação
         * - Alertar equipe de desenvolvimento
         */
        console.warn("Unknown event", type);
    }
  }

  // Registrar todos os listeners
  await registerAllListeners();

  // Iniciar servidor de webhooks
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
  });
}

/**
 * Função auxiliar que abstrai a publicação de eventos no EventBus.
 *
 * RESPONSABILIDADES:
 * - Criar o objeto BaseEvent com a estrutura correta
 * - Publicar no EventBus
 * - (Potencialmente) adicionar metadata como timestamp, source, etc.
 *
 * BENEFÍCIOS DA ABSTRAÇÃO:
 * DRY: não repete a estrutura do evento em vários lugares
 * Ponto único para adicionar metadata
 * Facilita testes e mocking
 * Centraliza lógica de publicação
 *
 * @param event - Tipo do evento interno (EventType)
 * @param payload - Dados do evento a serem propagados
 */
async function publish(event: EventType, payload: any) {
  await eventBus.publish({
    type: event,
    payload,
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
