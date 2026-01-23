export function resolveServices(dict, overrideItems) {
  if (overrideItems?.length) return overrideItems;
  const dictItems =
    dict?.pages?.services?.services ?? dict?.pages?.services?.items ?? [];
  return Array.isArray(dictItems) ? dictItems : [];
}

export function getHoverColumn(pointerX, rect) {
  if (!rect?.width) return "left";
  const mid = rect.left + rect.width / 2;
  return pointerX < mid ? "left" : "right";
}
