export function matchesScenePattern(fileName: string, sceneName: string): boolean {
  const sceneNameLower = sceneName.toLowerCase();
  const patterns = [
    sceneNameLower.replace(/\s+/g, '-'),
    sceneNameLower.replace(/\s+/g, ''),
    sceneNameLower.replace(/\s+/g, '_'),
    sceneNameLower,
  ];

  return patterns.some((pattern) => fileName.includes(pattern));
}
