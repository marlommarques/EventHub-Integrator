# 🧩 Cenário — Integração entre sistemas baseada em eventos

Muitas empresas utilizam sistemas de terceiros que **não possuem integração oficial ou homologada com o ERP**. Isso cria um problema clássico:

- o ERP concentra informações críticas (clientes, contratos, faturamento etc.)
- sistemas externos precisam consumir esses dados
- mas não existe um meio simples, estruturado e seguro de sincronizar as informações

Para contornar isso, alguns ERPs oferecem **um mecanismo de integração via eventos**, permitindo o cadastro de um **endpoint de webhook**. Sempre que algo relevante acontece — por exemplo um contrato é criado, alterado ou excluído — o ERP envia um evento HTTP para esse endpoint.

---

## 📬 Tipos comuns de eventos

No cenário de exemplo deste guia, o ERP envia três tipos de eventos relacionados a contratos:

- criação de contrato  
- alteração de contrato  
- exclusão de contrato  

Além disso, o ERP pode disponibilizar **endpoints de consulta (REST)** para buscar dados complementares. Na prática, isso é útil porque:

> muitas vezes o payload recebido no webhook **não contém todas as informações necessárias**. Ou seja, é comum enriquecer os dados consultando o ERP novamente.

---

## 🔧 Onde entra o EventHub Integrator

O **EventHub Integrator** atua como um **hub central de integração**:

1. recebe os eventos do ERP via webhook  
2. armazena e valida os eventos  
3. converte para um formato comum  
4. publica os eventos em um barramento interno  
5. módulos independentes consomem esses eventos e executam ações externas  

Esses módulos podem:

- enviar dados para APIs de terceiros  
- alimentar bancos externos  
- atualizar sistemas internos  
- gerar notificações  
- ou qualquer outra ação que dependa do evento  

Tudo isso **sem que o ERP precise conhecer esses sistemas**.

---

## 🧠 Por que esse modelo funciona bem?

Porque ele:

- evita integrações “ponto a ponto”
- reduz acoplamento
- facilita manutenção
- permite evolução contínua
- centraliza governança e segurança
- possibilita adicionar novos sistemas sem mexer no ERP

Ou seja:

> o ERP fala com **uma única aplicação** e essa aplicação conversa com o resto do mundo.

---

## 💬 Observação importante

Embora este guia use um ERP como exemplo,  
**o padrão pode ser aplicado em qualquer sistema que publique eventos**, como:

- CRMs  
- plataformas de e-commerce  
- gateways financeiros  
- ERPs legados  
- SaaS corporativos  

Sempre que existir um evento → existe um gatilho para integração.
