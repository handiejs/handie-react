import {
  EventWithNamespace,
  EventHandlers,
  isString,
  generateRandomId,
} from '@handie/runtime-core';

let idCounter = 0;

function generateWidgetId(): string {
  idCounter++;

  return `${generateRandomId('HandieReactWidget')}-${idCounter}`;
}

function getEventWithNamespace(reactEl: any, event: string = ''): EventWithNamespace {
  return `${event}.react_inst_${reactEl.__handieReactWidgetId}`;
}

function resolveBindEvent(
  reactEl: any,
  event: string | EventHandlers,
): EventWithNamespace | EventHandlers {
  let resolved: EventWithNamespace | EventHandlers;

  if (isString(event)) {
    resolved = getEventWithNamespace(reactEl, event as string);
  } else {
    resolved = {} as EventHandlers;

    Object.keys(event as EventHandlers).forEach(key => {
      resolved[getEventWithNamespace(reactEl, key)] = (event as EventHandlers)[key];
    });
  }

  return resolved;
}

export { generateWidgetId, getEventWithNamespace, resolveBindEvent };
