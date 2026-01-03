# Arquitetura — EventHub Integrator

## 🚀 Fluxo resumido

1. O ERP envia um webhook contendo um evento de **criação, alteração ou exclusão de contrato**
2. A API valida e registra o evento na base de dados
3. O evento é publicado em um barramento (pub/sub)
4. Módulos consumidores processam o evento de forma assíncrona
5. O sistema registra logs e métricas para rastreabilidade

---

## 🔧 A ideia do “canivete suíço”

A proposta desta arquitetura é criar uma aplicação que funcione como um **hub central de integração**, um verdadeiro “canivete suíço”:

- você cadastra apenas um webhook no ERP (ou o mínimo possível)
- esse webhook recebe os três tipos de eventos de contrato
- os eventos são registrados, tratados e publicados em um barramento
- múltiplos módulos e sistemas externos podem consumir esses eventos de forma independente

Ou seja:

- **um único ponto de entrada e infinitas possibilidades de saída**

Isso reduz esforço, evita múltiplas integrações diretas com o ERP e centraliza governança e segurança.

---

## 📈 Benefícios

- baixo acoplamento
- escalabilidade horizontal
- tolerância a falhas
- reutilização para qualquer integração
- governança centralizada

---

## 🛡️ Boas práticas aplicadas

- **idempotência**
- **retry com dead-letter**
- **versionamento de eventos**
- **observabilidade e rastreabilidade**
