/**
 * Objeto constante que define todos os tipos de eventos disponíveis no sistema.
 *
 * Uso do 'as const':
 * - Transforma o objeto em readonly profundo
 * - Garante que os valores sejam tratados como literais específicos ("CREATED")
 *   ao invés de tipos genéricos (string)
 * - Permite TypeScript inferir tipos mais precisos para EventType
 */
export const EventTypes = {
  CREATED: "CREATED", // Evento disparado quando uma entidade é criada
  CHANGED: "CHANGED", // Evento disparado quando uma entidade é modificada
  EXCLUDED: "EXCLUDED", // Evento disparado quando uma entidade é excluída
} as const;

/**
 * Union type que representa todos os tipos de eventos possíveis.
 *
 * Explicação da sintaxe:
 * - typeof EventTypes: obtém o tipo do objeto EventTypes
 * - keyof typeof EventTypes: extrai as chaves ("CREATED" | "CHANGED" | "EXCLUDED")
 * - [keyof typeof EventTypes]: acessa os valores dessas chaves
 *
 * Resultado final: "CREATED" | "CHANGED" | "EXCLUDED"
 *
 * Benefícios:
 * - Type-safety: apenas valores válidos são aceitos
 * - Autocomplete: o editor sugere os valores possíveis
 * - Único ponto de manutenção: adicionar novos eventos em EventTypes
 *   automaticamente atualiza este tipo
 */
export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

/**
 * Representa a configuração de um listener/subscriber no EventBus.
 *
 * Útil para:
 * - Armazenar referências de subscriptions para cleanup posterior
 * - Configurar múltiplos listeners de uma vez
 * - Documentar quais eventos um componente escuta
 */
export type Listener = {
  event: EventType; // O tipo de evento que será escutado
  handler: (event: BaseEvent) => void; // A função callback executada quando o evento ocorre
};

/**
 * Estrutura base de todos os eventos do sistema.
 * Todos os eventos específicos devem estender este tipo.
 *
 * @template T - Tipo genérico opcional para tipar o payload de forma específica
 */
export type BaseEvent = {
  type: EventType; // Identifica qual tipo de evento está sendo disparado
  payload: any; // Dados associados ao evento
  // timestamp?: Date; // Momento em que o evento foi criado
  // source?: string;  // Origem do evento
  // metadata?: Record<string, unknown>; // Dados adicionais opcionais
  // Adicione mais atraibutos conforme a necessidade, cada caso deve ser devidamente estudado
};
