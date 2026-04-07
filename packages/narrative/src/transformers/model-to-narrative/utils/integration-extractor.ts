/**
 * Extracts message name from integration destination configuration
 */
function extractMessageNameFromDestination(destination: Record<string, unknown>): string | null {
  if (destination.type !== 'integration') return null;

  const message = destination.message as Record<string, unknown> | undefined;
  const messageName = message?.name;
  return typeof messageName === 'string' && messageName.length > 0 ? messageName : null;
}

/**
 * Extracts message name from withState integration configuration
 */
function extractMessageNameFromWithState(withState: Record<string, unknown>): string | null {
  const origin = withState.origin as Record<string, unknown> | undefined;
  if (origin?.type !== 'integration') return null;

  const target = withState.target as Record<string, unknown> | undefined;
  const targetName = target?.name;
  return typeof targetName === 'string' && targetName.length > 0 ? targetName : null;
}

/**
 * Processes a single data item and extracts integration names
 */
function processDataItem(dataItem: Record<string, unknown>, set: Set<string>): void {
  const destination = dataItem.destination as Record<string, unknown> | undefined;
  if (destination) {
    const messageName = extractMessageNameFromDestination(destination);
    if (messageName !== null) set.add(messageName);
  }
  const withState = dataItem._withState as Record<string, unknown> | undefined;
  if (withState) {
    const messageName = extractMessageNameFromWithState(withState);
    if (messageName !== null) set.add(messageName);
  }
}

/**
 * Extracts all integration type names used in flows by analyzing
 * toIntegration() and fromIntegration() patterns in the flow data.
 *
 * @param flows Array of flow specifications to analyze
 * @returns Array of integration type names found in the flows
 */
export function extractTypeIntegrationNames(flows: Array<{ name: string; moments: unknown[] }>): string[] {
  const set = new Set<string>();

  for (const fl of flows) {
    const moments = fl.moments ?? [];
    for (const sl of moments) {
      const momentData = sl as Record<string, unknown>;
      const server = momentData.server as Record<string, unknown> | undefined;
      const data = server?.data as unknown[] | undefined;

      if (!Array.isArray(data)) continue;

      for (const item of data) {
        const dataItem = item as Record<string, unknown>;
        processDataItem(dataItem, set);
      }
    }
  }

  return Array.from(set);
}
