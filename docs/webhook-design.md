# 🔗 Design do Webhook

## Um único webhook para múltiplos eventos

Após testes e ajustes, a abordagem adotada neste guia utiliza um **único endpoint de webhook com parâmetros de rota**, por exemplo: /webhook/:event_type

Esse padrão traz vantagens como:

- **um único ponto de entrada**
- **facilidade para adicionar ou remover eventos**
- **redução de duplicação de código**
- **padronização do tratamento**
- **rastreamento e auditoria mais simples**
- **menos configurações no sistema emissor (ex: ERP)**

Ou seja: quando um novo evento surge — ou um existente deixa de existir — o impacto no código é mínimo.

---

## ⚠️ Porém — isso depende do contexto

Cada aplicação tem suas particularidades.

Se **não houver uma diferenciação clara entre payloads**, ou se existir risco de ambiguidade, é **recomendado criar variações adicionais nos parâmetros de rota**, por exemplo:
- /webhook/:origin/:event_type [/webhook/contracts/created, /webhook/billing/invoiced]

Ou até separar rotas por domínios de negócio.

O objetivo é manter a **identificação do evento o mais simples e clara possível**, evitando regras complexas de interpretação dentro do código.

---

## 🧩 O equilíbrio ideal

Um único webhook funciona muito bem quando:

✔ os eventos são bem definidos  
✔ o formato do payload é previsível  
✔ existe clareza sobre o `event_type`  

Mas **não existe solução única para todos os cenários** — o design deve priorizar:

- clareza
- simplicidade
- rastreabilidade
- manutenção futura

---

> Embora o endpoint seja único, a modularização ocorre na camada de consumo: cada módulo trata apenas os eventos que lhe dizem respeito. Isso mantém o sistema organizado e desacoplado.
