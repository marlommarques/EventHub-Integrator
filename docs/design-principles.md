# 🧠 Princípios de Design

Este guia foi construído com base em decisões práticas e orientadas à realidade. A ideia central é **entregar valor com simplicidade — e só adicionar complexidade quando realmente necessário.**

Abaixo estão os principais princípios aplicados.

---

## 🟢 1. Comece simples

Apesar de mencionarmos filas, barramentos e mensageria, **não é obrigatório utilizar Kafka, RabbitMQ, SQS, Redis Streams, etc.**

Uma versão funcional pode ser construída com:

- um event bus em memória  
- um `Map` para registrar handlers  
- despacho interno assíncrono  

Quando a carga, criticidade ou disponibilidade exigirem mais robustez, a arquitetura pode evoluir naturalmente.

---

## 🧩 2. Modularização real

Cada módulo consumidor deve ser:

- independente
- isolado
- responsável apenas pelo seu domínio

Isso permite:

✔ implantar módulos separadamente  
✔ desativar módulos sem afetar o core  
✔ versionar módulos independentemente  
✔ reduzir o impacto de mudanças  

---

## 🔌 3. ERP desacoplado de tudo

O ERP **não deve conhecer nenhum sistema externo**.  
Ele só fala com o hub. O hub faz o resto.

Isso aumenta:

- segurança
- governança
- controle operacional
- rastreabilidade

---

## 🔁 4. Idempotência é obrigatória

Eventos podem chegar:

- duplicados  
- fora de ordem  
- com atraso  

Então a aplicação deve garantir que **um mesmo evento não será processado duas vezes**.

Normalmente isso é feito registrando o `eventId`.

---

## 🛡️ 5. Resiliência acima de perfeição

Sistemas externos falham. Sempre.

Por isso a arquitetura prevê:

- retries
- dead-letter
- observabilidade
- logs estruturados
- rastreabilidade (traceId)

Falhou? Ok. Mas você **sabe o que aconteceu e pode reprocessar.**

---

## 🔗 6. Webhook simples — sem inventar moda

Um único endpoint parametrizado como: /webhook/:event_type

funciona muito bem na maioria dos cenários.

Mas…

**se os payloads forem ambíguos ou pouco padronizados**, é **recomendado criar variações adicionais na rota**, como:
- /webhook/contracts/:event_type
- /webhook/billing/:event_type
- /webhook/customer/:event_type

O critério principal é:

> priorize clareza e previsibilidade, não “elegância teórica”.

---

## 📊 7. Observabilidade desde o início

Mesmo em soluções simples, inclua:

- logs estruturados
- correlação por evento
- armazenamento mínimo de histórico

Sem isso, dar suporte vira sofrimento.

---

## 📈 8. Evolução natural

A arquitetura deve conseguir evoluir sem:

- reescrever tudo
- interromper operação
- redesenhar integrações
