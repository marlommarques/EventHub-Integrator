# 🧩 Módulos e Eventos

Um dos pilares do EventHub Integrator é a **separação clara entre o núcleo da aplicação e os módulos consumidores de eventos.**

---

## 🔄 Fluxo entre eventos e módulos

1. o ERP dispara um evento
2. o hub recebe o webhook
3. o evento é validado e registrado
4. o hub publica o evento internamente
5. um ou mais módulos consomem esse evento
6. cada módulo executa sua própria lógica

O núcleo **não sabe** o que cada módulo faz — e isso é intencional.

---

## 🧱 Estrutura conceitual

Um módulo normalmente contém:

- um identificador
- os tipos de eventos que ele consome
- a lógica de processamento
- tratamento de erros
- controle de retries

Exemplo conceitual:

```ts
registerConsumer({
  event: "CONTRACT_CREATED",
  handler: async (payload) => {
    // lógica de integração com terceiro
  }
});
```

---

## 📦 Independência entre módulos
Cada módulo deve ser:
- ✔ isolado
- ✔ substituível
- ✔ versionável

Isso permite:
- adicionar novas integrações sem mexer nas existentes
- remover módulos sem impacto no resto
- atualizar módulos de forma incremental

---

## Tipos de eventos comuns

No cenário ERP, por exemplo:
- CONTRACT_CREATED
- CONTRACT_UPDATED
- CONTRACT_DELETED

Mas nada impede:
- CUSTOMER_UPDATED
- INVOICE_GENERATED
- PAYMENT_CONFIRMED

Ou eventos internos como:
- EVENT_RETRY_SCHEDULED
- EVENT_MOVED_TO_DLQ

---

## 🛡️ Regra de ouro
> O módulo deve assumir responsabilidade pelo seu próprio domínio — e o hub deve permanecer genérico.

O hub não pode virar um lugar cheio de regras específicas de negócio.

---

## 🎛 Flexibilidade no tratamento

Cada módulo pode:
- enriquecer dados consultando o ERP
- transformar o payload
- validar regras próprias
- entregar para APIs externas
- gravar em bases específicas

Tudo isso sem impacto nos outros módulos.

---

## 📌 Benefícios diretos
- baixo acoplamento
- organização clara
- manutenção simples
- testes independentes
- escalabilidade modular

Exatamente o tipo de arquitetura que continua saudável com o tempo.

---