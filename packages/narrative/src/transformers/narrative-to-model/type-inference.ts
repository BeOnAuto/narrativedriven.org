import type { TypeInfo } from '../../loader/ts-utils';
import type { Message } from '../../schema';

/**
 * Convert a `Message` to the `TypeInfo` shape used by the resolver cascade.
 */
export function messageToTypeInfo(msg: Message): TypeInfo {
  return {
    stringLiteral: msg.name,
    classification: msg.type,
    dataFields: msg.fields.map((f) => ({ name: f.name, type: f.type, required: f.required })),
  };
}

export function buildTypeInfoFromMessages(messages: Map<string, Message>): Map<string, TypeInfo> | undefined {
  if (messages.size === 0) return undefined;
  const map = new Map<string, TypeInfo>();
  for (const [name, msg] of messages) {
    map.set(name, messageToTypeInfo(msg));
  }
  return map;
}
