# Decisões de Arquitetura

## Idempotência
Eventos podem chegar duplicados.  
Solução: registrar `eventId` e ignorar duplicados.

## Retry + Dead Letter
Falhas não quebram o fluxo.

## Versionamento de evento
Campos podem evoluir sem quebrar consumidores.

## Segurança
Todo webhook deve exigir autenticação e assinatura.
