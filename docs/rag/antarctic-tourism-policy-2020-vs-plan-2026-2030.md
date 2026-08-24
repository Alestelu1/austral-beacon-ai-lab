# Antarctic tourism policy comparison: 2020 → 2026–2030

This note compares the Política Nacional de Turismo Antártico (2020) with the Plan Estratégico Antártico 2026–2030.

Machine-readable matrix:

`data/analysis/antarctic-tourism-policy-2020-vs-plan-2026-2030.csv`

## Main conclusion

The 2026–2030 Plan broadens several themes already visible in the 2020 tourism policy.

### Direct continuity

- Punta Arenas and Puerto Williams as Antarctic gateway cities.
- Magallanes as a strategic Antarctic platform.
- Sustainable and regulated tourism.
- Infrastructure and logistics as enabling conditions.
- Environmental monitoring.
- Coordination among public and private actors.

### Expanded continuity

- Tourism platform → scientific, technological, logistical, cultural and tourism hub.
- Tourism education → wider Antarctic identity and education policy.
- SAR and safety requirements → broader aviation and logistics capability.
- Sustainable tourism → sustainability criteria across tourism, science and logistics.

### Policy-to-implementation transition

- Puerto Williams gateway role → explicit integrated Antarctic development task.
- Need for digital connectivity → staged Antarctic submarine cable program.
- Teniente Marsh as an air-connectivity advantage → runway, passenger and aviation-capability tasks.
- General infrastructure need → named infrastructure programs and project portfolios.

## Longitudinal entities

- `puerto_williams`
- `punta_arenas`
- `region_magallanes_antartica_chilena`
- `aerodromo_teniente_marsh`
- `peninsula_antartica`
- `sistema_tratado_antartico`
- `minrel`
- `inach`
- `mindef`
- `antarctic_tourism`
- `search_and_rescue`

## Temporal RAG rules

1. The 2020 policy is authoritative for policy context, not for proving that a route, service, operator or fare is still active.
2. The 2026–2030 task matrix represents planned and assigned actions, not proof of completion.
3. Implementation status must be supported by later evidence.
4. Keep `policy_date`, `planned_period`, `observation_date` and source provenance separate.

## Monitoring model

Use three layers for longitudinal policy tracking:

- baseline policy
- assigned plan/task
- verified implementation

Example:

```json
{
  "theme_id": "antarctic-gateway-puerto-williams",
  "entity_id": "puerto_williams",
  "baseline_2020": {
    "status": "policy_positioning",
    "claim": "gateway_city"
  },
  "plan_2026_2030": {
    "status": "assigned_task",
    "objective": 7,
    "task": 1
  },
  "implementation": {
    "status": "unknown",
    "last_verified": null,
    "evidence": []
  }
}
```

## Project routing

| Project | Use |
|---|---|
| Austral Intelligence Radar | Track policy intent, assigned tasks and verified implementation |
| Antarctica Begins | Explain Chilean gateway strategy and access model |
| Austral Connectivity Observatory | Track air, maritime, terrestrial and digital connectivity |
| End of the World Atlas | Link gateway cities and infrastructure entities |
| Antarctic Pulse | Environmental, science and education context |
| End of the World Travel | Use only after current operational claims are verified |

## Next step

Promote the highest-value longitudinal themes into canonical JSON records with an `implementation_status` layer. Then compare official policy capacity with current first-party operator material from DAP and Antarctica21.
